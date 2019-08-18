import React from "react";
import { IFilm, IPages } from "../interfaces";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { paginate } from "../tools/pagination";
import * as actions from "../actions";
import unavailableimg from "../img/unavailable.gif";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

interface IPropsGlobal {
  token: string;
  storedFilms: any[];
  pageInfo: IPages;

  saveLastFilms: (films: any[]) => void;
  setPages: (pages: IPages) => void;
}
const FilmLocal: React.FC<IPropsGlobal> = props => {
  const [calculateAvg, setCalculateAvg] = React.useState<boolean>(false);
  const [ready, setReady] = React.useState(false);

  const updateItemsPerPage = (event: React.ChangeEvent<any>) => {
    const newpages = Math.ceil(
      props.storedFilms.length / +event.currentTarget.value
    );
    props.setPages({
      ...props.pageInfo,
      itemsPerPage: +event.currentTarget.value,
      current: 1,
      total: newpages
    });
  };
  const updateSortMode = (event: React.ChangeEvent<any>) => {
    props.setPages({
      ...props.pageInfo,
      current: 1,
      sortMode: +event.currentTarget.value
    });
  };

  const updateSortOrder = (event: React.ChangeEvent<any>) => {
    props.setPages({
      ...props.pageInfo,
      current: 1,
      sortOrder: +event.currentTarget.value
    });
  };

  const sortFilms = (array: IFilm[], option: number, order: number) => {
    array.sort(function(a, b) {
      if (a.original_title < b.original_title) {
        return -1;
      }
      if (a.original_title > b.original_title) {
        return 1;
      }
      return 0;
    });
    switch (option) {
      case 0:
        array.sort((a: IFilm, b: IFilm) => b.nReviews - a.nReviews);
        break;
      case 1:
        array.sort((a: IFilm, b: IFilm) => b.average - a.average);
        break;
      case 2:
        array.sort((a: IFilm, b: IFilm) => {
          const hDate: any = new Date(b.release_date);
          const lDate: any = new Date(a.release_date);
          return hDate - lDate;
        });
        break;
    }
    if (order === 0) {
      array.reverse();
    }
  };

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
          const films = props.storedFilms;
          reviewdata.map((row: any) => {
            const { film_id, nReviews, average } = row;
            const film: any = films.find(f => f.id === film_id);
            film.nReviews = nReviews;
            film.average = average;
          });
          props.saveLastFilms([...films]);
          setReady(true);
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
          if (props.storedFilms.length === 0) props.saveLastFilms(localFilms);
          setCalculateAvg(true);
          const totp = Math.ceil(
            localFilms.length / props.pageInfo.itemsPerPage
          );
          props.setPages({
            ...props.pageInfo,
            total: totp
          });
        });
      }
    });
  };
  React.useEffect(() => retrieveLocalFilms(), [props.storedFilms.length]);
  React.useEffect(() => {
    if (calculateAvg && props.storedFilms.length > 0) {
      const idsarray = props.storedFilms.map(f => f.id);
      getAvgReviews(idsarray);
      setCalculateAvg(false);
    }
  }, [calculateAvg]);

  const nextPage = () => {
    if (props.pageInfo.current < props.pageInfo.total) {
      props.setPages({
        ...props.pageInfo,
        current: props.pageInfo.current + 1
      });
    }
  };
  const prevPage = () => {
    if (props.pageInfo.current > 1) {
      props.setPages({
        ...props.pageInfo,
        current: props.pageInfo.current - 1
      });
    }
  };

  const setPage = (page: number) => {
    props.setPages({
      ...props.pageInfo,
      current: +page
    });
  };

  sortFilms(
    props.storedFilms,
    props.pageInfo.sortMode,
    props.pageInfo.sortOrder
  );

  if (!ready) return null;
  return (
    <div>
      {props.storedFilms.length <= 0 && (
        <div className="columns is-centered">
          <div className="column is-5-tablet is-4-desktop is-3-widescreen">
            <div className="box has-background-grey-dark has-text-light">
              <h6>It seems that there are no commented movies yet</h6>
              <br />
              <div className="buttons has-text-centered">
                <Link to={"/search"} className="button is-dark">
                  View Popular Movies Online
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {props.storedFilms.length > 0 && (
        <div
          className="card has-background-dark"
          css={css`
            padding: 10px;
            width: 100% !important;
            background-color: rgb(44, 44, 44) !important;
            margin-bottom: 5px;
            color: rgb(215, 215, 215) !important;
            font-size: 0.8em;
            top: 51px;
            position: fixed;
            z-index: 2;
          `}
        >
          <div className="columns">
            <div className="column is-one-fifth">
              Showing:{" "}
              {(props.pageInfo.current - 1) * props.pageInfo.itemsPerPage + 1} -{" "}
              {props.pageInfo.current === props.pageInfo.total
                ? props.storedFilms.length
                : props.pageInfo.current * props.pageInfo.itemsPerPage}{" "}
              (of:{"  "}
              {props.storedFilms.length})
            </div>
            <div className="column">
              <div className="field has-addons is-pulled-left">
                <div className="control">
                  <div className="select is-dark is-small">
                    <select
                      value={props.pageInfo.sortMode}
                      onChange={updateSortMode}
                    >
                      <option value="0">Reviews</option>
                      <option value="1">Rating</option>
                      <option value="2">Release date</option>
                    </select>
                  </div>
                </div>
                <div className="control">
                  <div className="select is-dark is-small">
                    <select
                      value={props.pageInfo.sortOrder}
                      onChange={updateSortOrder}
                    >
                      <option value="0">Ascending</option>
                      <option value="1">Descending</option>
                    </select>
                  </div>
                </div>
                <div className="control">
                  <div className="select is-dark is-small">
                    <select
                      value={props.pageInfo.itemsPerPage}
                      onChange={updateItemsPerPage}
                    >
                      <option value="4">4</option>
                      {props.storedFilms.length > 4 && (
                        <option value="8">8</option>
                      )}
                      {props.storedFilms.length > 8 && (
                        <option value="16">16</option>
                      )}
                      {props.storedFilms.length > 16 && (
                        <option value={props.storedFilms.length}>All</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              {/* Paginate */}
              {props.pageInfo.total > 1 && (
                <div className="field is-pulled-right">
                  {props.pageInfo.current > 1 && (
                    <a
                      onClick={prevPage}
                      css={css`
                        margin-right: 5px;
                      `}
                    >
                      <i className="fas fa-chevron-left has-text-light" />
                    </a>
                  )}
                  {props.pageInfo.current > 1 && (
                    <a
                      css={css`
                        font-size: 0.8em;
                      `}
                      onClick={() => setPage(1)}
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
                    {props.pageInfo.current}
                  </span>
                  {props.pageInfo.current !== props.pageInfo.total && (
                    <a
                      css={css`
                        font-size: 0.8em;
                      `}
                      className="has-text-light"
                      onClick={() => setPage(props.pageInfo.total)}
                    >
                      {props.pageInfo.total}
                    </a>
                  )}
                  {props.pageInfo.current !== props.pageInfo.total && (
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
<div></div>
      <div
        css={css`
          margin-top: 50px;
        `}
        className="localfilms-list"
      >
        <div className="columns is-multiline is-mobile is-centered">
          {paginate(
            props.storedFilms,
            props.pageInfo.current,
            props.pageInfo.itemsPerPage
          ).map(
            (f: any) =>
              0 === 0 && (
                <Link to={`/film/${f.id}`} key={f.id}>
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
                              : unavailableimg
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
  storedFilms: globalState.storedFilms,
  token: globalState.token,
  pageInfo: globalState.storedPages
});

const mapDispatchToProps = {
  saveLastFilms: actions.saveLastFilms,
  setPages: actions.savePages
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmLocal);
