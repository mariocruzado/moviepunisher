import React from "react";
import { IFilm } from "../interfaces";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { paginate } from "../tools/pagination";
//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

interface IPropsGlobal {
  token: string;
}
const FilmLocal: React.FC<IPropsGlobal> = props => {
  const [localFilms, setLocalFilms] = React.useState<any[]>([]);
  const [calculateAvg, setCalculateAvg] = React.useState<boolean>(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const getAvgReviews = (idsarray: any[]) => {
    fetch("http://localhost:8080/api/reviews/film/avg/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      },
      body: JSON.stringify(idsarray)
    }).then(response => {
      if (response.ok) {
        response.json().then((reviewdata: any) => {
          const films = localFilms;
          reviewdata.map((row: any) => {
            const { film_id, nReviews, average } = row;
            const film: any = films.find(f => f.id === film_id);
            film.nReviews = nReviews;
            film.average = average;
          });
          setLocalFilms([...films]);
        });
      } else {
        console.log("not ok");
      }
    });
    return null;
  };

  const retrieveLocalFilms = () => {
    fetch("http://localhost:8080/api/films/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((localFilms: IFilm[]) => {
          setLocalFilms(localFilms);
          setCalculateAvg(true);
          const totp = Math.ceil(localFilms.length / 8);
          setTotalPages(totp);
        });
      }
    });
  };
  React.useEffect(() => retrieveLocalFilms(), []);
  React.useEffect(() => {
    if (calculateAvg && localFilms.length > 0) {
      const idsarray = localFilms.map(f => f.id);
      getAvgReviews(idsarray);
      const orderedFilms = [...localFilms].sort(
        (a, b) => b.nReviews - a.nReviews
      );
      setLocalFilms(orderedFilms);
      setCalculateAvg(false);
    }
  }, [calculateAvg]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <div>
      {localFilms.length <= 0 && (
                  <div className="columns is-centered">
    <div className="column is-5-tablet is-4-desktop is-3-widescreen">
<div className="box has-background-grey-dark has-text-light">
  <h6>It seems that there are no commented movies yet</h6>
  <br/>
  <div className="buttons has-text-centered">
  <Link to={'/search'} className="button is-dark">View Popular Movies Online</Link>
  </div>
  </div>
      </div>
      </div>
      )}
      {localFilms.length > 0 && (
        <div
          className="card has-background-dark"
          css={css`
            padding: 10px;
            width: 100% !important;
            background-color: rgb(34, 34, 34) !important;
            margin-bottom: 5px;
            color: rgb(215, 215, 215) !important;
            font-size: 0.8em;
            top: 51px;
            position: fixed;
            z-index: 50;
          `}
        >
          <div className="columns">
            <div className="column is-6">
            Showing: {(currentPage - 1) * 8 + 1} -{" "}
                  {currentPage === totalPages
                    ? localFilms.length
                    : currentPage * 8}{" "}
                  (of:{"  "}
                  {localFilms.length})
            </div>
            <div className="column is-6">
              {/* Paginate */}
              {totalPages > 1 && (
                <div className="is-pulled-right">
                  {currentPage > 1 && (
                    <a
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

      <div
        css={css`
          margin-top: 50px;
        `}
      >
        <div className="columns is-multiline is-mobile is-centered">
          {paginate(localFilms, currentPage, 8).map(
            (f: any) =>
              0 === 0 && (
                <Link to={`/${f.id}`} key={f.id}>
                  <div className="column is-three-quarters-mobile is-half-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd">
                    <div className="cellphone-container">
                      <div className="movie">
                        <div className="menu">
                          <i className="fas fa-film" />
                        </div>
                        <img
                          className="movie-img"
                          src={
                            f.poster_path
                              ? `https://image.tmdb.org/t/p/w400/${
                                  f.poster_path
                                }`
                              : `http://roblucastaylor.com/wp-content/uploads/2017/07/cover-image-unavailable.jpg`
                          }
                        />

                        <div className="text-movie-cont">
                          <div className="mr-grid">
                            <div className="col1">
                              <h1 className="specialtitle">
                                {f.original_title.length > 38
                                  ? f.original_title.substring(0, 35) + "..."
                                  : f.original_title}
                              </h1>
                              <ul className="movie-gen">
                                <li>
                                  Released: {f.release_date} / Country:{" "}
                                  {f.original_language
                                    ? f.original_language.toUpperCase()
                                    : ""}
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="mr-grid">
                            <div className="col2 movie-likes">
                              <i className="fas fa-star" />
                              <span>
                                {" "}
                                {f.average
                                  ? f.average.toFixed(1)
                                  : "Not rated yet"}
                              </span>
                            </div>
                            <div className="col2">
                              <ul className="movie-likes">
                                <li>
                                  <span>{f.nReviews ? f.nReviews : 0} </span>
                                  <i className="fas fa-newspaper" />
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="mr-grid">
                            <div className="col1">
                              <p className="movie-description">
                                {f.overview && f.overview.length > 200
                                  ? f.overview.substring(0, 197) + "..."
                                  : f.overview}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token
});
export default connect(
  mapStateToProps,
  null
)(FilmLocal);
