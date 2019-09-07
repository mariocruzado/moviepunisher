import React from "react";
import jwt from "jsonwebtoken";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "react-router-dom";
import { dateFormat } from "../tools/dateFormats";
import { paginate } from "../tools/pagination";

interface IPropsGlobal {
  token: string;
}
const UserReviews: React.FC<IPropsGlobal & any> = props => {
  const [reviews, saveReviews] = React.useState<any | null>([]);
  const [rewards, saveRewards] = React.useState<any | null>([]);

  const [display, setDisplay] = React.useState("reviews");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [ready, setReady] = React.useState<boolean>(false);

  const decodedToken = React.useMemo(() => {
    const dToken = jwt.decode(props.token);
    if (dToken !== null && typeof dToken !== "string") {
      return dToken;
    }
    return null;
  }, []);

  const retrieveReviews = (userid: number) => {
    fetch(`http://localhost:8080/api/reviews/user/${userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((reviews: any) => {
          saveReviews(reviews);
          const totp = Math.ceil(reviews.length / 5);
          setTotalPages(totp);
          setReady(true);
        });
      }
    });
  };

  const retrieveUserRewards = (userid: number) => {
    fetch(`http://localhost:8080/api/rewards/${userid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((rewards: any) => {
          saveRewards(rewards);
        });
      }
    });
  };

  //Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };
  React.useEffect(() => {
    retrieveReviews(props.user_id);
    retrieveUserRewards(props.user_id);
  }, [props.user_id]);

  if (!ready) return null;
  return (
    <div>
      <div className="tabs">
        <ul>
          <li className={`${display === "reviews" ? "is-active" : ""}`}>
            <a onClick={() => setDisplay("reviews")}>
              <span><i className="fas fa-edit"></i></span>
              {' '}{`Reviews (${reviews.length})`}
            </a>
          </li>
          <li className={`${display === "rewards" ? "is-active" : ""}`}>
            <a onClick={() => setDisplay("rewards")}>
            <span><i className="fas fa-star"></i></span>
              Rewards ({rewards.length})
              </a>
          </li>
        </ul>
        { decodedToken!.id === +props.user_id && (
            <div css={css`margin:10px !important;`}>
              <Link className="button is-light is-small" to={'/update'}><i className="fas fa-edit"></i>{' Edit profile'}</Link>
            </div>
          )}
      </div>
      {display === "reviews" && (
        <div id="top">
          {reviews.length === 0 && (
            <div
              className="card has-background-dark"
              css={css`
                padding: 10px;
                width: 100% !important;
                background-color: rgb(34, 34, 34) !important;
                margin-bottom: 5px;
                color: rgb(215, 215, 215) !important;
                font-size: 0.8em;
              `}
            >
              This user haven't reviewed any film yet!
            </div>
          )}
          {reviews.length > 0 && (
            // Pagination
            <div
              className="card has-background-dark"
              css={css`
                padding: 10px;
                width: 100% !important;
                background-color: rgb(34, 34, 34) !important;
                margin-bottom: 5px;
                color: rgb(215, 215, 215) !important;
                font-size: 0.8em;
              `}
            >
              <div className="columns">
                <div className="column is-one-fifth">
                  Showing: {(currentPage - 1) * 5 + 1} -{" "}
                  {currentPage === totalPages
                    ? reviews.length
                    : currentPage * 5}{" "}
                  (of:{"  "}
                  {reviews.length})
                </div>
              </div>
            </div>
          )}
          {paginate(reviews, currentPage, 5).map((r: any) => (
            <div
              className="card has-background-dark"
              key={r.id}
              css={css`
                margin-bottom: 15px;
                box-shadow: 3px 3px 11px rgb(0, 0, 0);
                color: rgb(231, 222, 185);
              `}
            >
              <div
                css={css`
                  padding: 10px;
                  width: 100% !important;
                  background-color: rgb(34, 34, 34);
                `}
              >
                <div className="columns">
                  <div
                    className="column"
                    css={css`
                      padding-left: 26px !important;
                    `}
                  >
                    <i className="fas fa-film has-text-light" />
                    <span
                      css={css`
                        margin-left: 10px;
                      `}
                      className="is-size-6 has-text-light"
                    >
                      {r.film_title}
                    </span>
                  </div>
                  <div className="column has-text-right">
                    <span className="has-text-light is-size-7">
                      {dateFormat(r.date, true)} (#{r.id})
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="columns">
                  <div className="column is-2">
                    <div
                      css={css`
                        display: flex;
                        justify-content: center;
                      `}
                    >
                      <Link to={`/film/${r.film_id}`}>
                        <figure className="image">
                          <img
                            css={css`
                              max-width: 260px !important;
                            `}
                            src={
                              r.film_cover
                                ? `https://image.tmdb.org/t/p/w400/${r.film_cover}`
                                : `http://roblucastaylor.com/wp-content/uploads/2017/07/cover-image-unavailable.jpg`
                            }
                          />
                        </figure>
                      </Link>
                    </div>
                  </div>
                  <div className="column is-10">
                    <i
                      className="far fa-edit"
                      css={css`
                        margin-right: 10px;
                      `}
                    />
                    <h5
                      className="is-subtitle has-text-light is-inline"
                      css={css`
                        margin-bottom: 0px !important;
                      `}
                    >
                      <i>"{r.title}"</i>
                    </h5>
                    <br />
                    <i
                      className="fas fa-star is-size-7"
                      css={css`
                        margin-right: 10px;
                      `}
                    />
                    <span className="is-size-7">{r.rating}</span>
                    <p
                      className="is-size-7 has-text-light"
                      css={css`
                        margin-top: 15px;
                        color: rgb(255, 235, 215);
                      `}
                    >
                      {r.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            // Pagination
            <div
              className="card has-background-dark"
              css={css`
                padding: 10px;
                width: 100% !important;
                background-color: rgb(34, 34, 34) !important;
                margin-top: -10px;
                color: rgb(215, 215, 215) !important;
                font-size: 0.8em;
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
                          <i className="fas fa-chevron-left has-text-light" />
                        </a>
                      )}
                      {currentPage > 1 && (
                        <a
                          href="#top"
                          css={css`
                            font-size: 0.8em;
                          `}
                          onClick={() => setCurrentPage(1)}
                          className="has-text-light"
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
                          className="has-text-light"
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
                          <i className="fas fa-chevron-right has-text-light" />
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
      {display === "rewards" && (
        <div>
                    {rewards.length === 0 && (
            <div
              className="card has-background-dark"
              css={css`
                padding: 10px;
                width: 100% !important;
                background-color: rgb(34, 34, 34) !important;
                margin-bottom: 5px;
                color: rgb(215, 215, 215) !important;
                font-size: 0.8em;
              `}
            >
              This user haven't earned any reward yet!
            </div>
          )}
          {rewards.length > 0 && (
          <div
            className="card has-background-dark"
            css={css`
              padding: 10px;
              width: 100% !important;
              background-color: rgb(34, 34, 34) !important;
              margin-bottom: 5px;
              color: rgb(215, 215, 215) !important;
              font-size: 0.8em;
            `}
          >
            {rewards.map((r: any) => (
              <div
                className="box has-background-dark has-text-light"
                key={r.id}
              >
                <div className="columns">
                  <div className="column is-one-fifth">
                    <figure className="image is-64x64">
                      <i className="fas fa-gifts is-large"></i>
                    </figure>
                  </div>
                  <div className="column">
                    <h1 css={css`font-size:1.5em;`}>{r.prize}</h1>
                    <span>Earned on: {dateFormat(r.date, false)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token
});

export default connect(
  mapStateToProps,
  null
)(UserReviews);
