import React from "react";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers/global";
import { descriptionChecker, passwordChecker } from "../tools/fieldChecker";
import * as actions from "../actions";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

//jQuery
import $ from "jquery";

import jwt from "jsonwebtoken";
import { IUser } from "../interfaces";
import { Link, RouteComponentProps } from "react-router-dom";
import { longStackSupport } from "q";

interface IPropsGlobal {
  token: string;
  expirationId: number;

  reset: () => void;
}

const UserEdit: React.FC<IPropsGlobal & RouteComponentProps<any>> = props => {
  const [myUser, setMyUser] = React.useState<IUser | null>(null);
  const [description, setDescription] = React.useState("");
  const [userpass, setUserpass] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [avatarFromProfile, setAvatarFromProfile] = React.useState(
    "classic.png"
  );

  const [changePass, enableChangePass] = React.useState<boolean>(false);
  const [changeDesc, enableChangeDesc] = React.useState<boolean>(true);

  const [profiles, saveProfiles] = React.useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = React.useState(1);

  //Saving decoded token
  const decodedToken = React.useMemo(() => {
    const dToken = jwt.decode(props.token);
    if (dToken !== null && typeof dToken !== "string") {
      return dToken;
    }
    return null;
  }, [props.token]);

  const updateDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget.value.length < 251) {
      setDescription(event.currentTarget.value);
    }
  };
  const updateUserpass = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !event.currentTarget.value.includes(" ") &&
      event.currentTarget.value.length < 21
    ) {
      setUserpass(event.currentTarget.value);
      setLabel("");
    }
  };
  const updateSelectedProfile = (event: React.ChangeEvent<any>) => {
    setSelectedProfileId(event.currentTarget.value);
  };

  //Retrieve profiles from database

  const getProfiles = () => {
    fetch(`http://localhost:8080/api/users/all/profiles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((profiles: any) => {
          saveProfiles(profiles);
        });
      }
    });
  };

  const getMyUser = (userid: number) => {
    fetch("http://localhost:8080/api/users/" + userid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((user: IUser) => {
          setMyUser(user);
          setDescription(user.description);
          setSelectedProfileId(user.profile_id);
          setUserpass("");
        });
      }
    });
  };

  //logout for password change
  const logOut = () => {
    props.reset();
    localStorage.removeItem("token");
    window.clearTimeout(props.expirationId);
    props.history.push("/");
  };

  //Disabling/Enabling password changing
  const switchPassOption = () => {
    if (changePass) {
      enableChangePass(false);
      setUserpass("");
      setLabel("");
    } else enableChangePass(true);
  };

  React.useEffect(() => {
    getProfiles();
    getMyUser(decodedToken!.id);
  }, []);

  const updateUser = (userid: number) => {
    if (changePass && !passwordChecker(userpass)) {
      setLabel("* Please enter a valid password (6 characters min.)");
    } else {
      fetch("http://localhost:8080/api/users/" + userid, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token
        },
        body: JSON.stringify({
          ...(changePass &&
            userpass &&
            passwordChecker(userpass) && { password: userpass }),
          ...(description &&
            descriptionChecker(description) && { description: description }),
          profile_id: selectedProfileId
        })
      }).then(response => {
        if (response.ok)
          response.json().then((user: IUser) => {
            if (changePass) { 
              updateWithPassModal();
            }
            else props.history.push(`/profile/${decodedToken!.id}`);
          });
      });
    }
  };

  //Delete account
  const deleteUser = (userid: number) => {
    fetch("http://localhost:8080/api/users/" + userid, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok)
        response.json().then((_response: any) => {
          logOut();
        });
    });
  };

  //Clicking delete function
  const deleteModal = () => {
    $(".modal1").addClass("is-active");
  };

  const updateWithPassModal = () => {
    $(".modal2").addClass('is-active');
  }

  //Modal clicking options
  React.useEffect(() => {
    $(".butaccept").click(function() {
      $(".modal").removeClass("is-active");
      deleteUser(decodedToken!.id);
    });
    $(".modal-close, .butclose").click(function() {
      $(".modal").removeClass("is-active");
    });
    $(".modal-close2, .butclose2").click(function() {
      $(".modal2").removeClass("is-active");
      logOut();
    });
  }, []);

  return (
    <div className="hero-body">
      {/* Modal delete user */}
      <div className="modal modal1">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Warning!</p>
            <button className="delete modal-close" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            Are you sure? This is a non-reversible operation!
          </section>
          <footer className="modal-card-foot">
            <button className="button is-danger butaccept" aria-label="close">
              Delete
            </button>
            <button className="button is-dark butclose" aria-label="close">
              Cancel
            </button>
          </footer>
        </div>
      </div>
{/* Modal Password updated */}
      <div className="modal modal2">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Password updated successfully!</p>
            <button className="delete modal-close2" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            Now you're being redirected to the login page. Please sign in with your new credentials!
          </section>
          <footer className="modal-card-foot">
            <button className="button is-dark butclose2" aria-label="close">
              Accept
            </button>
          </footer>
        </div>
      </div>

      <div className="container">
        <div className="columns is-centered">
          <div className="box has-background-light">
            <div className="columns">
              <div className="column">
                <label className="label is-small">Password:</label>
                <div className="field has-addons is-centered">
                  <div className="control">
                    <input
                      onChange={updateUserpass}
                      value={userpass}
                      className="input is-small"
                      type="password"
                      placeholder="******"
                      disabled={!changePass ? true : false}
                    />
                  </div>
                  <div className="control">
                    <button
                      className="button is-small"
                      onClick={switchPassOption}
                    >
                      <i className="fas fa-unlock" />
                    </button>
                  </div>
                </div>
                {label && (
                  <small
                    data-testid="invalid_span"
                    className="has-text-danger"
                    css={css`
                      margin: 0px !important;
                      padding: 0px !important;
                      font-size: 0.66em;
                    `}
                  >
                    {label}
                  </small>
                )}
                <div className="field">
                  <label className="label is-small">
                    Description (Optional):
                  </label>
                  <textarea
                    value={description?description:''}
                    onChange={updateDescription}
                    className="textarea is-small has-fixed-size"
                    placeholder="*Enter 25-1500 characters"
                    css={css`
                      width: 100%;
                    `}
                  />
                </div>
                <div className="field">
                  <label className="label is-small">Profile</label>
                  <div className="columns">
                    <div className="column">
                      <div className="control">
                        <div className="select is-small">
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
                    <div className="column">
                      <div
                        className="field"
                        css={css`
                          text-align: center;
                        `}
                      >
                        {profiles.length > 0 && (
                          <img
                            css={css`
                              max-width: 70px;
                            `}
                            src={require("../img/" +
                              profiles[selectedProfileId - 1].avatar)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button
                  className="button is-dark is-small"
                  onClick={() => updateUser(decodedToken!.id)}
                >
                  Update
                </button>
              </div>
              <div className="control">
                <Link
                  className="button is-warning is-small"
                  to={`/profile/${decodedToken!.id}`}
                >
                  Discard
                </Link>
              </div>
              <div className="control">
                <button onClick={deleteModal} className="button is-danger is-small">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token,
  expirationId: globalState.expirationId
});
const mapDispatchToProps = {
  reset: actions.reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserEdit);
