import React from "react";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { IGlobalState } from "../reducers/global";
import { IUser } from "../interfaces";
import { connect } from "react-redux";
import jwt from "jsonwebtoken";
import { dateFormat } from "../tools/dateFormats";
import { RouteComponentProps } from "react-router-dom";

interface IPropsGlobal {
  token: string;
}
const UserDetails: React.FC<IPropsGlobal & { user_id: number }> = props => {
  const [user, setUser] = React.useState<any>({});

  const decodedToken = React.useMemo(() => {
    const dToken = jwt.decode(props.token);
    if (dToken !== null && typeof dToken !== "string") {
      return dToken;
    }
    return null;
  }, [props.token]);

  React.useEffect(() => getUserInfo(props.user_id), []);

  const getUserInfo = (id: number) => {
    fetch("http://localhost:8080/api/users/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((user: IUser) => {
          setUser(user);
        });
      }
    });
  };

  return (
    <div
      className="box has-background-grey-dark has-text-light"
      css={css`
        margin: 10px auto !important;
      `}
    >
      <div className="columns">
        <div className="column is-4">
          <div
            css={css`
              display: flex;
              justify-content: center;
            `}
          >          <figure
          className="image is-128x128"
          css={css`
            margin: 0px !important;
          `}
        >
          {user.profile_avatar && (
            <img src={require("../img/" + user.profile_avatar)} />
          )}
        </figure></div>

        </div>
        <div className="column is-8">
          <div className="columns">
            <div className="column is-3">
              <span>Name:</span>
            </div>
            <div className="column is-9">
              <span> {user.username}</span>
            </div>
          </div>
          <div className="columns">
            <div className="column is-3">
              <span>Profile:</span>
            </div>
            <div className="column is-9">
              <span>{user.profile_name}</span>
            </div>
          </div>
          <div className="columns">
            <div className="column is-3">
              <span>Description:</span>
            </div>
            <div className="column is-9">
              <p className="is-size-7">{user.description}</p>
            </div>
          </div>
          <div className="columns">
            <div className="column is-3">
              <span>Registration Date:</span>
            </div>
            <div className="column is-9">
              {user.regdate && <span>{user.regdate.split("T")[0]}</span>}
            </div>
          </div>
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
)(UserDetails);
