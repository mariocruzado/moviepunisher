import React from "react";
import { connect } from "react-redux";
import { IGlobalState } from "../../../../../React/weatherbycity/src/reducers/global";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { dateFormat } from "../tools/dateFormats";
import jwt from "jsonwebtoken";
import Comments from "./Comments";
import {
  reviewContentChecker,
  reviewTitleChecker
} from "../tools/fieldChecker";

interface IPropsGlobal {
  token: string;
}

const FilmReviews: React.FC<IPropsGlobal & any> = props => {
  const [reviews, saveReviews] = React.useState<any>([]);

  const [displayNewReview, setDisplayNewReview] = React.useState(false);

  const [reviewTitle, setReviewTitle] = React.useState("");
  const [reviewContent, setReviewContent] = React.useState("");
  const [rating, setRating] = React.useState(3);

  const [label, setLabel] = React.useState(false);

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
      event.currentTarget.value.length < 501
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
        });
      }
    });
  };

  //Check if user have already reviewed the film
  const checkIfReviewed = () => {
    return reviews.find((r: any) => r.user_id === decodedToken!.id)
      ? true
      : false;
  };

  React.useEffect(() => retrieveReviews(props.film_id), []);

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
        });
      }
    });
  };

  const reviewFieldChecker = () => {
    let res = false;
    if (reviewContentChecker(reviewContent) && reviewTitleChecker(reviewTitle))
      res = true;
    return res;
  };

  //Add a Review
  const addReview = () => {
    if (reviewFieldChecker() && decodedToken) {
      const comment = {
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
        body: JSON.stringify(comment)
      }).then(response => {
        if (response.ok) {
          response.json().then((review: any) => {
            saveReviews([review, ...reviews]);
            displayReviewForm();
            setReviewTitle("");
            setReviewContent("");
            setRating(3);
          });
        }
      });
    } else {
      setLabel(true);
    }
  };

  return (
    <div
      className="box reviews has-background-white"
      css={css`
        margin-top: 10px;
      `}
    >
      {reviews.length > 0 && (
        <div>
        <h1 className="title is-size-6">
          Showing all reviews ({reviews.length})
        </h1>
        <hr/>
        </div>
      )}
      {!checkIfReviewed() && !displayNewReview && (
        <div
          className="has-text-left"
          css={css`
            margin-bottom: 20px;
          `}
        >
          <button
            className="button is-success is-size-6"
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
          {reviews.length > 0 && <hr />}
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
                      <select onChange={updateRating}>
                        <option
                          value="1"
                          selected={rating === 1 ? true : false}
                        >
                          Bad
                        </option>
                        <option
                          value="2"
                          selected={rating === 2 ? true : false}
                        >
                          Not bad
                        </option>
                        <option
                          value="3"
                          selected={rating === 3 ? true : false}
                        >
                          Regular
                        </option>
                        <option
                          value="4"
                          selected={rating === 4 ? true : false}
                        >
                          Good
                        </option>
                        <option
                          value="5"
                          selected={rating === 5 ? true : false}
                        >
                          Excellent
                        </option>
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
                      className={`textarea is-small has-fixed-size ${label ? "is-danger" : ""}`}
                      placeholder="*Enter 100-500 characters"
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
                  <button onClick={addReview} className="button">
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
          {reviews.length > 0 && <hr />}
        </div>
      )}
      {/* //Reviews */}
      {reviews.map((r: any) => (
        <article className="media" key={r.id}>
          <div className="media-content">
            <div className="content">
              <div className="box">

                <div className="columns">
                  <div className="column is-1">
                    <div className="image is-64x64">
                      <img src={require("../img/" + r.profile_avatar)} />
                    </div>
                  </div>
                  <div className="column is-5">
                    <h6 className="is-block">
                      <i>"{r.title}</i>"
                    </h6>
                    {r.user_isadmin != 0 && (
                      <i
                        className="fas fa-dragon has-text-link"
                        css={css`
                          margin-right: 5px;
                        `}
                      />
                    )}
                    <small className="is-subtitle">
                      by: <b>{r.user_username}</b>
                    </small>
                  </div>
                  <div className="column is-6">
                    {/* RIGHT BOX */}
                    <div className="columns">
                      <div className="column is-5">
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
                      <div className="column is-4">
                        <small
                          className="is-small"
                          css={css`
                            margin: 5px;
                          `}
                        >
                          {dateFormat(r.date, false)}
                        </small>
                      </div>
                      {(decodedToken!.isAdmin ||
                        r.user_id === decodedToken!.id) && (
                        <div
                          className="column is-3"
                        >
                          <div className="is-pulled-right" css={css`margin-right:10px;font-size:0.8em;`}>
                            <a>
                              <span className="icon is-small">
                                <i className="fas fa-edit" />
                              </span>{" "}
                              <span>
                                Edit
                              </span>
                            </a> {' | '}
                            <a onClick={() => deleteReview(r.id)}>
                              <span className="icon is-small has-text-danger">
                                <i className="fa fa-trash" />
                              </span>{" "}
                              <span>
                                Delete
                              </span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div css={css`margin-bottom:15px;margin-top:15px; !important;`}>
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
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token,
  films: globalState.token
});

export default connect(
  mapStateToProps,
  null
)(FilmReviews);
