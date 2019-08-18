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
  const [ready, setReady] = React.useState<boolean>(false);

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
          setReady(true);
        });
      }
    });
  };

  if (!ready) return null;
  return (
    <div
      className="box has-text-light"
      css={css`
        margin: 10px auto !important;
        padding:50px;
        background-color:rgb(34,34,34);
      `}
    >
      <div className="columns">
        <div className="column is-2">
          <div
            css={css`
              display: flex;
              justify-content: center;
            `}
          >
            {" "}
            <figure
              className="image is-128x128"
              css={css`
                margin: 0px !important;
                border: 1px solid black;
                padding: 5px;
                background-color: rgb(56, 56, 56);
                border-radius: 10px;
                box-shadow: 5px 5px 10px rgb(0, 0, 0);
              `}
            >
              
              <img src={require("../img/" + user.profile_avatar)} />
            </figure>
          </div>
        </div>
        <div className="column is-5 has-background-dark" css={css`border-radius:10px;padding:25px;border:1px solid black;box-shadow:5px 5px 10px black;`}>
          <div className="columns">
            <div className="column is-5">
              <span
                css={css`
                  color: rgb(205, 205, 205) !important;
                `}
              >
                Username:
              </span>
            </div>
            <div className="column is-7">
              <span className="is-italic"> {user.username}</span>
            </div>
          </div>
          <div className="columns">
            <div className="column is-5">
              <span
                css={css`
                  color: rgb(205, 205, 205) !important;
                `}
              >
                Profile:
              </span>
            </div>
            <div className="column is-7">
              <span className="is-italic">{user.profile_name}</span>
            </div>
          </div>
          <div className="columns">
            <div className="column is-5">
              <span
                css={css`
                  color: rgb(205, 205, 205) !important;
                `}
              >
                Member since:
              </span>
            </div>
            <div className="column is-7">
              <span className="is-italic">{dateFormat(user.regdate,true)}</span>
            </div>
          </div>
        </div>
        <div className="column is-5">
          <div className="columns">
          <div className="column is-one-fifth has-text-right">
          </div>
          <div className="column">
            <p className="is-italic has-text-grey-light">{user.description?user.description:'No user description...'}</p>
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
