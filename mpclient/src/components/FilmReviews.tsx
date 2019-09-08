import React from "react";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers/global";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";


import { dateFormat } from "../tools/dateFormats";
import jwt from "jsonwebtoken";
import Comments from "./Comments";
import { Route, Link } from "react-router-dom";
import {
  reviewContentChecker,
  reviewTitleChecker
} from "../tools/fieldChecker";
import EditReview from "./EditReview";
import * as actions from "../actions";
import { IFilm } from "../interfaces";
import { paginate } from '../tools/pagination';

interface IPropsGlobal {
  token: string;
  actualFilm: IFilm;

  addFilm: (film: IFilm) => void;
  deleteFilm: (filmid: number) => void;
}

const FilmReviews: React.FC<IPropsGlobal & { film_id: number }> = props => {
  const [reviews, saveReviews] = React.useState<any>([]);

  const [displayNewReview, setDisplayNewReview] = React.useState(false);
  const [displayEdit, setDisplayEdit] = React.useState(false);

  const [reviewTitle, setReviewTitle] = React.useState("");
  const [reviewContent, setReviewContent] = React.useState("");
  const [rating, setRating] = React.useState(3);

  const [reviewToEdit, setReviewToEdit] = React.useState(-1);

  const [label, setLabel] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const updateReviewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !(event.currentTarget.value.charAt(0) === " ") &&
      event.currentTarget.value.length < 51
    ) {
      setReviewTitle(event.currentTarget.value);
    }
  };

  const updateReviewContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (
      !(event.currentTarget.value.charAt(0) === " ") &&
      event.currentTarget.value.length < 1501
    ) {
      setReviewContent(event.currentTarget.value);
      setLabel(false);
    }
  };

  const updateRating = (event: React.ChangeEvent<any>) => {
    setRating(event.currentTarget.value);
  };

  const displayReviewForm = () => setDisplayNewReview(!displayNewReview);

  const decodedToken = React.useMemo(() => {
    const dToken = jwt.decode(props.token);
    if (dToken !== null && typeof dToken !== "string") {
      return dToken;
    }
    return null;
  }, [props.token]);

  const retrieveReviews = (filmid: number) => {
    fetch(`http://localhost:8080/api/reviews/film/${filmid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((reviews: any) => {
          saveReviews(reviews);
          const totp = Math.ceil(reviews.length / 4);
          setTotalPages(totp);
        });
      }
    });
  };

  const editReview = (reviewid: number) => {
    setReviewToEdit(reviewid);
    setDisplayEdit(true);
  };

  //Check if user have already reviewed the film
  const checkIfReviewed = () => {
    return reviews.find((r: any) => r.user_id === decodedToken!.id)
      ? true
      : false;
  };

  React.useEffect(() => retrieveReviews(props.film_id), []);
  React.useEffect(() => retrieveReviews(props.film_id), [reviews.length]);

  //Delete a review
  const deleteReview = (reviewid: number) => {
    fetch(`http://localhost:8080/api/reviews/${reviewid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((review: any) => {
          const rIndex = reviews.findIndex((r: any) => r.id === review.review);
          if (rIndex !== -1) reviews.splice(rIndex, 1);
          saveReviews([...reviews]);
          setTotalPages(Math.ceil(reviews.length / 4));
          if (reviews.length === 0) {
            removeFilm(props.actualFilm.id);
          }
        });
      }
    });
  };

  //Remove film when reviews is empty
  const removeFilm = (filmid: number) => {
    fetch(`http://localhost:8080/api/films/${filmid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((_film: any) => {
          props.deleteFilm(filmid);
        }).catch((err) => { throw err });
        ;
      }
    })
  };

  const reviewFieldChecker = () => {
    let res = false;
    if (reviewContentChecker(reviewContent) && reviewTitleChecker(reviewTitle))
      res = true;
    return res;
  };

    //Enter event for button inside the form
    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      addReview();
    };

  //Add a Review
  const addReview = () => {
    if (reviewFieldChecker() && decodedToken) {
      const rvw = {
        user_id: decodedToken!.id,
        content: reviewContent,
        title: reviewTitle,
        rating: rating <= 0 ? 1 : rating
      };
      fetch(`http://localhost:8080/api/reviews/${props.film_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token
        },
        body: JSON.stringify(rvw)
      }).then(response => {
        if (response.ok) {
          response.json().then((review: any) => {
            reviews.unshift(review);

            saveReviews([...reviews]);
            displayReviewForm();
            setReviewTitle("");
            setReviewContent("");
            setRating(3);
            setTotalPages(Math.ceil(+reviews.length / 4));
            setCurrentPage(1);

            //Save film in local database
            if (props.actualFilm) {
              fetch(`http://localhost:8080/api/films/${props.actualFilm.id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + props.token
                },
                body: JSON.stringify({
                  overview: props.actualFilm.overview,
                  poster_path: props.actualFilm.poster_path,
                  release_date: props.actualFilm.release_date,
                  original_title: props.actualFilm.original_title,
                  original_language: props.actualFilm.original_language
                })
              }).then(response => {
                if (response.ok) {
                  response.json().then(result => {
                    if (!result.included) {
                      props.addFilm(result);
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      setLabel(true);
    }
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <div
    id="top"
      css={css`
        margin-top: 10px;
        margin: auto;
      `}
    >
      {displayEdit && (
        <EditReview
          review_id={reviewToEdit}
          close_edit={() => setDisplayEdit(false)}
          rlist={reviews}
        />
      )}
      {!displayEdit && props.actualFilm.id > 0 && (
        <div
          className="box reviews"
          css={css`
            border-radius: 0px 0px 10px 10px;
            background-color: rgba(255, 255, 255, 0.8) !important;
          `}
        >
                    {!checkIfReviewed() && !displayNewReview && (
            <div
              className="has-text-left"
              css={css`
                margin-bottom: ${reviews.length > 0 ? "20px" : "0px"};
              `}
            >
              <button
                className="button is-dark is-size-6"
                onClick={displayReviewForm}
              >
                <i
                  className="fas fa-plus-circle"
                  css={css`
                    margin-right: 10px;
                  `}
                />
                Add New Review
              </button>
            </div>
          )}
          {displayNewReview && (
            <div>
              <form onSubmit={onFormSubmit}>
              <div className="box">
                <div className="control field">
                  <div className="columns">
                    <div className="column is-2">
                      <span>Title: </span>
                    </div>
                    <div className="column is-10">
                      <input
                        type="text"
                        className="input is-rounded"
                        value={reviewTitle}
                        onChange={updateReviewTitle}
                      />
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column is-2">
                      <span>Rating: </span>
                    </div>
                    <div className="column is-10">
                      <div className="control">
                        <div className="select is-rounded">
                          <select value={rating} onChange={updateRating}>
                            <option value="1">Terrible</option>
                            <option value="2">Bad</option>
                            <option value="3">Regular</option>
                            <option value="4">Good</option>
                            <option value="5">Excellent</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="control field">
                    <div className="columns">
                      <div className="column is-2">
                        <span>Content: </span>
                      </div>
                      <div className="column is-10">
                        <textarea
                          value={reviewContent}
                          onChange={updateReviewContent}
                          className={`textarea is-small has-fixed-size ${
                            label ? "is-danger" : ""
                          }`}
                          placeholder="*Enter 25-1500 characters"
                          css={css`
                            width: 100%;
                          `}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="field">
                    <div className="control buttons">
                      <button type="submit" className="button">
                        Post Review
                      </button>
                      <button
                        className="button is-danger"
                        onClick={displayReviewForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </form>
              {reviews.length > 0 && <hr />}
            </div>
          )}
           {/* Pagination */}
        {reviews.length > 0 && (
          <div
            className="card has-background-light has-text-grey-dark"
            css={css`
              padding: 10px;
              width: 100% !important;
              margin-bottom: 5px;
              font-size: 0.9em;
              border-radius:10px;
            `}
          >
            <div className="columns">
              <div className="column">
                Showing: {(currentPage - 1) * 4 + 1} -{" "}
                {currentPage === totalPages
                  ? reviews.length
                  : currentPage * 4}{" "}
                (of:{"  "}
                {reviews.length})
              </div>
            </div>
          </div>
        )}
          {/* //Reviews */}
          {paginate(reviews, currentPage, 4).map((r: any) => (
            <article className="media" key={r.id}>
              <div className="media-content">
                <div className="content">
                  <div className="box has-background-light">
                    <div className="columns">
                      <div className="column is-one-fifth">
                        <div
                          css={css`
                            display: flex;
                            justify-content: center;
                          `}
                        >
                          <figure className="image">
                            <Link to={`/profile/${r.user_id}`}>
                              <img
                                css={css`
                                  max-width: 30% !important;
                                  min-width: 100px !important;
                                `}
                                src={require("../img/" + r.profile_avatar)}
                              />
                            </Link>
                          </figure>
                        </div>
                      </div>
                      <div className="column">
                        <h6 className="is-block">
                          <i>"{r.title}</i>"
                        </h6>
                        <small className="is-subtitle">
                          by:{" "}
                          <Link to={`/profile/${r.user_id}`}>
                            <b>{r.user_username}</b>
                          </Link>
                        </small>
                        {r.user_isadmin != 0 && (
                          <i
                            className="fas fa-shield-alt has-text-link"
                            css={css`
                              margin-left: 5px;
                            `}
                          />
                        )}
                        {r.modifiedby && (
                          <span
                            className="is-subtitle is-size-7"
                            css={css`
                              margin-left: 10px;
                            `}
                          >
                            (Edited by: <strong>{r.modifiedby_username}</strong>
                            )
                          </span>
                        )}
                      </div>
                      <div className="column">
                        {/* RIGHT BOX */}
                        <div className="columns">
                          <div className="column is-size-7">
                            {[...Array(parseInt(r.rating ? r.rating : 0))].map(
                              (i, j) => (
                                <i
                                  className="fas fa-star has-text-danger"
                                  key={j}
                                />
                              )
                            )}

                            {[...Array(5 - parseInt(r.rating))].map((i, j) => (
                              <i
                                className="far fa-star has-text-danger"
                                key={r.rating + j}
                              />
                            ))}
                          </div>
                          <div className="column">
                            <small
                              className="is-size-7"
                              css={css`
                                margin: 5px;
                              `}
                            >
                              {dateFormat(r.date, false)}
                            </small>
                          </div>
                          {(decodedToken!.isAdmin ||
                            r.user_id === decodedToken!.id) && (
                            <div className="column is-one-quarter">
                              <div
                                className="is-pulled-right"
                                css={css`
                                  margin-right: 10px;
                                  font-size: 0.95em;
                                `}
                              >
                                <a onClick={() => editReview(r.id)}>
                                  <span className="icon is-small">
                                    <i className="fas fa-edit" />
                                  </span>
                                </a>{" "}
                                <a onClick={() => deleteReview(r.id)}>
                                  <span className="icon is-small has-text-danger">
                                    <i className="fa fa-trash" />
                                  </span>
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      css={css`margin-bottom:15px;margin-top:15px; !important;`}
                    >
                      <p
                        css={css`
                          font-size: 0.9rem !important;
                        `}
                      >
                        {r.content}
                      </p>
                    </div>
                    <Comments review_id={r.id} />
                  </div>
                </div>
              </div>
            </article>
          ))}
           {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="card has-background-light has-text-grey-dark"
            css={css`
              padding: 10px;
              width: 100% !important;
              margin-bottom: 5px;
              margin-top: 5px;
              font-size: 0.9em;
              border-radius:8px;
            `}
          >
            <div className="columns">
              <div className="column">
                {/* Paginate */}
                {totalPages > 1 && (
                  <div className="has-text-right">
                    {currentPage > 1 && (
                      <a
                      href="#top"
                        onClick={prevPage}
                        css={css`
                          margin-right: 5px;
                        `}
                      >
                        <i className="fas fa-chevron-left has-text-dark" />
                      </a>
                    )}
                    {currentPage > 1 && (
                      <a
                      href="#top"
                        css={css`
                          font-size: 0.8em;
                        `}
                        onClick={() => setCurrentPage(1)}
                        className="has-text-dark"
                      >
                        1
                      </a>
                    )}

                    <span
                      css={css`
                        margin-left: 10px;
                        margin-right: 10px;
                        font-weight: bolder;
                      `}
                      className="has-text-link"
                    >
                      {currentPage}
                    </span>
                    {currentPage !== totalPages && (
                      <a
                      href="#top"
                        css={css`
                          font-size: 0.8em;
                        `}
                        className="has-text-dark"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </a>
                    )}
                    {currentPage !== totalPages && (
                      <a
                      href="#top"
                        onClick={nextPage}
                        css={css`
                          margin-left: 5px;
                        `}
                      >
                        <i className="fas fa-chevron-right has-text-dark" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token,
  films: globalState.token,
  actualFilm: globalState.actualFilm
});

const mapDispatchToProps = {
  addFilm: actions.addFilm,
  deleteFilm: actions.deleteFilm
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmReviews);
