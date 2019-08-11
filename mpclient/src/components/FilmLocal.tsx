import React from "react";
import { IFilm } from "../interfaces";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

interface IPropsGlobal {
  token: string;
}
const FilmLocal: React.FC<IPropsGlobal> = props => {
  const [localFilms, setLocalFilms] = React.useState<IFilm[]>([]);
  const [calculateAvg, setCalculateAvg] = React.useState<boolean>(false);

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
        });
      }
    });
  };
  React.useEffect(() => retrieveLocalFilms(), []);
  React.useEffect(() => {
    if (calculateAvg) {
      const idsarray = localFilms.map(f => f.id);
      getAvgReviews(idsarray);
      const orderedFilms = [...localFilms].sort(
        (a, b) => b.nReviews - a.nReviews
      );
      setLocalFilms(orderedFilms);
      setCalculateAvg(false);
    }
  }, [calculateAvg]);

  return (
    <div>
      <div className="columns is-multiline is-mobile is-centered">
        {localFilms.slice(0,20).map(f => (
            f.nReviews > 0 && (
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
                        ? `https://image.tmdb.org/t/p/w400/${f.poster_path}`
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
                            {f.original_language?f.original_language.toUpperCase():''}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mr-grid">
                      <div className="col2 movie-likes">
                        <i className="fas fa-star" />
                        <span>
                          {" "}
                          {f.average ? f.average.toFixed(1) : "Not rated yet"}
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
          </Link>
            )))}
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
