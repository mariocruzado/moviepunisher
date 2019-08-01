import React from "react";
import { connect } from "react-redux";
import { IGlobalState } from "../../../../../React/weatherbycity/src/reducers/global";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { Link } from "react-router-dom";
import { dateFormat } from "../tools/dateFormats";
import jwt from "jsonwebtoken";

interface IPropsGlobal {
  token: string;
}

const FilmReviews: React.FC<IPropsGlobal & any> = props => {
  const [reviews, saveReviews] = React.useState([]);

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
        response.json().then(async (reviews: any) => {
          await saveReviews(reviews);

          //   reviews.map((r: any) => {
          //     retrieveComments(r.id);
          //   });
        });
      }
    });
  };

  //Check if user have already reviewed the film
  const checkIfReviewed = () => {
    reviews.map((r: any) => {
      if (r.user_id == decodedToken!.id) {
        console.log(true);
        return true;
      }
    });
    return false;
  };

  //Get comments from reviews
  const retrieveComments = (reviewid: number) => {
    fetch(`http://localhost:8080/api/comments/review/${reviewid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((comments: any) => {
          const reviewIndex = reviews.findIndex(
            (i: any) => i.id == comments[0].review_id
          );
          const review: any = reviews[reviewIndex];
          review.comments = comments;

          saveReviews([...reviews]);
        });
      }
    });
    return null;
  };
  React.useMemo(() => retrieveReviews(props.film_id), []);

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
            const rIndex = reviews.findIndex((r:any) => r.id === review.review);
            if (rIndex) reviews.splice(rIndex, 1);
            saveReviews([...reviews]);
            //   reviews.map((r: any) => {
            //     retrieveComments(r.id);
            //   });
          });
        }
      });    
  }
  return (
    <div
      className="box reviews has-background-white"
      css={css`
        margin-top: 10px;
      `}
    >
      {reviews.length > 0 && (
        <h1 className="title is-size-6">
          Showing all reviews ({reviews.length})
        </h1>
      )}

      <hr />
      {reviews.map((r: any) => (
        <article className="media" key={r.id}>
          <div className="media-left box">
            <div className="columns">
              {[...Array(parseInt(r.rating ? r.rating : 0))].map((i, j) => (
                <i className="fas fa-star has-text-danger" key={j} />
              ))}

              {[...Array(5 - parseInt(r.rating))].map((i, j) => (
                <i className="far fa-star has-text-danger" key={r.rating + j} />
              ))}
            </div>
            <div className="columns">
              <small
                className="is-small"
                css={css`
                  margin: 5px;
                `}
              >
                {dateFormat(r.date, true)}
              </small>
            </div>
          </div>
          <figure className="media-left">
            <p className="image is-64x64">
              <img src={require("../img/" + r.profile_avatar)} />
            </p>
          </figure>
          <div className="media-content">
            <div className="content">
              <p>
                {r.user_isadmin != 0 && (
                  <i
                    className="fas fa-dragon has-text-link"
                    css={css`
                      margin-right: 5px;
                    `}
                  />
                )}
                <strong>{r.user_username}</strong>
                <div css={css`margin-bottom:15px;margin-top:15px; !important;`}>
                {r.content}
                </div>
                  <a>
                    <span className="icon is-small">
                      <i className="fas fa-reply" />
                    </span>{" "}
                    <small>Reply</small>
                  </a>
                  {(decodedToken!.isAdmin ||
                    r.user_id === decodedToken!.id) && (
                    <div className="is-inline" css={css`margin:15px !important;`}>
                      <a>
                        <span className="icon is-small">
                          <i className="fas fa-edit" />
                        </span>{" "}
                      </a>
                      <a onClick={() => deleteReview(r.id)}>
                        <span className="icon is-small has-text-danger">
                          <i className="fa fa-trash" />
                        </span>{" "}
                      </a>
                    </div>
                  )}
              </p>
            </div>
            {/* Comments */}
            {/* {r.id !== null &&
              r.comments.map((c: any) => (
                <article className="media box">
                  <figure className="media-left">
                    <p className="image is-48x48">
                      <img src={c.profile_avatar} />
                    </p>
                  </figure>
                  <div className="media-content">
                    <div className="content">
                      <p>
                        <strong>{c.user_username}</strong>
                        <br />
                        {c.content}
                        <br />
                        <small>
                          <a>Like</a> · <a>Reply</a> · 2 hrs
                        </small>
                      </p>
                    </div>
                  </div>
                </article>
              ))} */}
          </div>
        </article>
      ))}

      {!checkIfReviewed() && (
        <article className="media">
          <figure className="media-left">
            <p className="image is-64x64">
              <img src="https://bulma.io/images/placeholders/128x128.png" />
            </p>
          </figure>
          <div className="media-content">
            <div className="field">
              <p className="control">
                <textarea className="textarea" placeholder="Add a comment..." />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button">Post comment</button>
              </p>
            </div>
          </div>
        </article>
      )}
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
