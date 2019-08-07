import React from "react";
import jwt from "jsonwebtoken";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

interface IPropsGlobal {
  token: string;
}
const UserReviews: React.FC<IPropsGlobal & any> = props => {
  const [reviews, saveReviews] = React.useState<any>([]);
  const [display, setDisplay] = React.useState("reviews");

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
        });
      }
    });
  };

  React.useEffect(() => retrieveReviews(decodedToken!.id), []);
  return (
    <div className="box">
      <div className="tabs">
        <ul>
          <li className={`${display === "reviews" ? "is-active" : ""}`}>
            <a onClick={() => setDisplay("reviews")}>
              Reviews ({reviews.length})
            </a>
          </li>
          <li className={`${display === "awards" ? "is-active" : ""}`}>
            <a onClick={() => setDisplay("awards")}>Awards</a>
          </li>
        </ul>
      </div>
      {display === "reviews" && (
        <div>
          {reviews.map((r: any) => (
            <div className="card" key={r.id}
            css={css`margin-bottom:5px;`}>
              <div className="card-header"
              css={css`padding:10px;`}
              >
                <div className="card-header-title" />
                <span>{r.title} (#{r.id})</span>
              </div>
              <div className="card-content">
                <p>{r.content}</p>
              </div>
            </div>
          ))}
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
