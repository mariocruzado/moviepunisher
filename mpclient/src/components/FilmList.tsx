import React, { useEffect } from "react";
import { IGlobalState } from "../reducers/global";
import * as actions from "../actions";
import { connect } from "react-redux";

const formatDate = () => {
  const today = new Date();
  let day: any = today.getDate();
  let month: any = today.getMonth() + 1;
  const year = today.getFullYear();

  if (day < 10) day = "0" + day.toString();
  if (month < 10) month = "0" + month.toString();

  return `${year}-${month}-${day}`;
};

interface IPropsGlobal {
  token: string;
  storedFilms: any[];

  saveLastFilms: (films: any[]) => void;
}
const FilmList: React.FC<IPropsGlobal> = props => {
  const getLastFilms = () => {
    const apiUrl = "https://api.themoviedb.org/3/";
    const apiKey = "api_key=51c725de6ddb9024213b00473cda137b";
    const apiByDate = `discover/movie?primary_release_date.gte=2019-06-04&primary_release_date.lte=${formatDate()}`;
    fetch(`${apiUrl}${apiByDate}&${apiKey}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then(response => {
      if (response.ok) {
        response.json().then((films: any) => {
          props.saveLastFilms(films.results);
        });
      }
    });
  };

  const getAvgReviews = (idsarray: any[]) => {
    console.log(idsarray);
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
          console.log(reviewdata);
          reviewdata.map((row: any) => {
            const { film_id, nReviews, average } = row;
            const film = films.find(f => f.id === film_id);
            film.nReviews = nReviews;
            film.average = Number(average);
          });
          props.saveLastFilms([...films]);
        });
      } else {
        console.log("not ok");
      }
    });
    return null;
  };

  const avgInt = (decimal: number) => {
    return Math.round(decimal);
  };

  React.useMemo(() => getLastFilms(), []);
  React.useEffect(() => {
    const idsarray = props.storedFilms.map(f => f.id);
    getAvgReviews(idsarray);
  }, [props.storedFilms.length]);

  return (
      <div className="columns is-multiline is-mobile is-centered">
        {props.storedFilms.map(f => (
          <div className="column is-three-quarters-mobile is-half-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd" key={f.id}>
            <div className="cellphone-container">
              <div className="movie">
                <div className="menu">
                  <i className="fas fa-film" />
                </div>
                <img
                  className="movie-img"
                  src={`https://image.tmdb.org/t/p/w400/${f.poster_path}`}
                />
                <div className="text-movie-cont">
                  <div className="mr-grid">
                    <div className="col1">
                      <h1>
                        {f.original_title.length > 40
                          ? f.original_title.substring(0, 37) + "..."
                          : f.original_title}
                      </h1>
                      <ul className="movie-gen">
                        <li>
                          Released: {f.release_date} / Country:{" "}
                          {f.original_language.toUpperCase()}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mr-grid">
                    <div className="col2 movie-likes">
                          <span>
                            {f.average ? f.average : "Not rated yet"}{" "}
                          </span>
                          {[...Array(parseInt(f.average ? f.average : 0))].map(
                            () => (
                              <i className="fas fa-star" />
                            )
                          )}

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
                        {f.overview.length > 200
                          ? f.overview.substring(0, 197) + "..."
                          : f.overview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  storedFilms: globalState.storedFilms,
  token: globalState.token
});

const mapDispatchToProps = {
  saveLastFilms: actions.saveLastFilms
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmList);
