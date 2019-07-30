import React from "react";
import { IGlobalState } from '../reducers/global';
import * as actions from '../actions';
import { connect } from "react-redux";

const formatDate = () => {

  const today = new Date();
  let day:any = today.getDate();
  let month:any = today.getMonth() + 1;
  const year = today.getFullYear();

  if (day < 10) day = '0' + day.toString();
  if (month < 10) month = '0' + month.toString();

  return `${year}-${month}-${day}`;
};

interface IPropsGlobal {
    storedFilms: any[];

    saveLastFilms:(films:any[]) => void;
}
const Main: React.FC<IPropsGlobal> = (props) => {
  const getLastFilms = () => {
    const apiUrl = "https://api.themoviedb.org/3/";
    const apiKey = "api_key=51c725de6ddb9024213b00473cda137b";
    const apiByDate = `discover/movie?primary_release_date.gte=2019-06-04&primary_release_date.lte=${formatDate()}`;
    fetch(`${apiUrl}${apiByDate}&${apiKey}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then(response => {
      if (response.ok) {
        response.json().then((films:any) => {
            props.saveLastFilms(films.results);
            console.log(props.storedFilms);
        })
      } else {
        console.log("yay");
      }
    });
  };
  React.useMemo(() => getLastFilms(), []);
  
  return (
      <div>
          {props.storedFilms.map(f => (
              <p key={f.id}>{f.title}</p>
          ))}
      </div>
  );
};

const mapStateToProps = (globalState:IGlobalState) => ({
    storedFilms: globalState.storedFilms
});

const mapDispatchToProps = {
    saveLastFilms: actions.saveLastFilms
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);
