import React from "react";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { IGlobalState } from "../reducers/global";
import { IUser } from "../interfaces";
import { connect } from "react-redux";
import jwt from "jsonwebtoken";
import { dateFormat } from '../tools/dateFormats';

interface IPropsGlobal {
  token: string;
}
const UserDetails: React.FC<IPropsGlobal & any> = props => {
  const [user, setUser] = React.useState<any>({});

  const decodedToken = React.useMemo(() => {
    const dToken = jwt.decode(props.token);
    if (dToken !== null && typeof dToken !== "string") {
      return dToken;
    }
    return null;
  }, [props.token]);
  
  React.useEffect(() => getUserInfo(decodedToken!.id), []);


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
    <div className="box">
      <div className="columns">
        <div className="column is-2">
          <div className="image is-128x128">
              {user.profile_avatar && (<img src={require("../img/" + user.profile_avatar)} />)}
            
          </div>
        </div>
        <div className="column is-10">
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
              <span>Email:</span>
            </div>
            <div className="column is-9">
            <span>{user.email}
            </span>
            </div>
          </div>
          <div className="columns">
            <div className="column is-3">
              <span>Description:</span>
            </div>
            <div className="column is-9">
            <textarea className="textarea" value={user.description} 
            disabled
            />
            </div>
          </div>
          <div className="columns">
            <div className="column is-3">
              <span>Registration Date:</span>
            </div>
            <div className="column is-9">
                {user.regdate && (<span>{(user.regdate).split('T')[0]}
            </span>)}

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
