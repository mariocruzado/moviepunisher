import React from "react";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import "../tools/fieldChecker";
import {
  usernameChecker,
  emailChecker,
  passwordChecker
} from "../tools/fieldChecker";
import { IUser } from "../interfaces";
import { RouteComponentProps, Link } from "react-router-dom";
import { alphanumericChecker } from "../tools/fieldChecker";

interface IPropsGlobal {}
const Register: React.FC<IPropsGlobal & RouteComponentProps> = props => {
  const [username, setUsername] = React.useState("");
  const [userpass, setUserpass] = React.useState("");
  const [useremail, setUseremail] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [avatarFromProfile, setAvatarFromProfile] = React.useState(
    "classic.png"
  );

  const [profiles, saveProfiles] = React.useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = React.useState(1);

  const checkFields = () => {
    if (
      emailChecker(useremail) &&
      usernameChecker(username) &&
      passwordChecker(userpass)
    )
      return true;
    return false;
  };

  const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !event.currentTarget.value.includes(" ") &&
      alphanumericChecker(event.currentTarget.value)
    )
      setUsername(event.currentTarget.value);
  };

  const updateUserpass = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.value.includes(" "))
      setUserpass(event.currentTarget.value);
  };
  const updateUseremail = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.value.includes(" ")) {
      setUseremail(event.currentTarget.value);
    }
  };
  const updateSelectedProfile = (event: React.ChangeEvent<any>) => {
    setSelectedProfileId(event.currentTarget.value);
  };

    //To set enter key function without submit default
    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      registerUser();
    };

  const getProfiles = () => {
    fetch(`http://localhost:8080/api/users/all/profiles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (response.ok) {
          response.json().then((profiles: any) => {
            saveProfiles(profiles);
          });
        }
      })
      .catch(e => console.log("Angel " + e));
  };

  React.useEffect(getProfiles, []);

  const registerUser = () => {
    if (checkFields()) {
      const newUser = {
        username: username,
        password: userpass,
        email: useremail,
        profile_id: selectedProfileId
      };
      fetch(`http://localhost:8080/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      })
        .then(response => {
          if (response.ok) {
            response.json().then((user: IUser) => {
              props.history.push(`/`);
              alert("User created successfully! Log in with your credentials");
            });
          } else if (response.status === 409) {
            setLabel("User already exists!");
          }
        })
        .catch(e => console.log("Angel " + e));
    } else {
      alert("Fill the fields correctly, please!");
    }
  };
  return (
    <div
      className="box"
      css={css`
        min-width: 50%;
      `}
    >
    <form onSubmit={onFormSubmit}>
      <div className="field">
        <h1 className="title has-text-black">New User</h1>
        <hr />
      </div>
      <div className="columns">
        <div className="column is-8">
          <div className="field">
            <label className="label">Username</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className={`input ${usernameChecker(username) &&
                  "is-success"} ${label.length > 0 && "is-danger"}`}
                type="text"
                placeholder="Text input"
                value={username}
                onChange={updateUsername}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user" />
              </span>
              {usernameChecker(username) && (
                <span className="icon is-small is-right">
                  <i className="fas fa-check" />
                </span>
              )}
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className={`input ${
                  !passwordChecker(userpass) ? "" : "is-success"
                }`}
                type="password"
                placeholder="*****"
                onChange={updateUserpass}
                value={userpass}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-key" />
              </span>
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control has-icons-left has-icons-right">
              <input
                className={`input ${
                  !emailChecker(useremail) ? "is-danger" : "is-success"
                }`}
                type="text"
                placeholder="Email input"
                value={useremail}
                onChange={updateUseremail}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope" />
              </span>
              {!emailChecker(useremail) && (
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle" />
                </span>
              )}
            </div>
          </div>
          {label && (
            <small
              data-testid="invalid_span"
              className="has-text-danger"
              css={css`
                margin: 0px !important;
                padding: 0px !important;
              `}
            >
              {label}
            </small>
          )}
        </div>
        <div className="column is-4">
          <div className="field">
            <label className="label">Profile</label>
            <div className="control">
              <div className="select">
                <select
                  value={selectedProfileId}
                  onChange={updateSelectedProfile}
                >
                  {profiles.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div
            className="field"
            css={css`
              text-align: center;
            `}
          >
            {profiles.length > 0 && (
              <img
                css={css`
                  max-width: 140px;
                `}
                src={require("../img/" +
                  profiles[selectedProfileId - 1].avatar)}
              />
            )}
          </div>
        </div>
      </div>
      <hr />
      <div className="field is-grouped">
        <div className="control">
          <button
            className="button is-link"
            disabled={!checkFields()}
            type="submit"
          >
            Sign Up!
          </button>
        </div>
        <div className="control">
          <Link className="button is-dark" to={`/`}>
            Go Back
          </Link>
        </div>
      </div>
      </form>
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
