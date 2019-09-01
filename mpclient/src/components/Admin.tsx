import React from "react";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers/global";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

//Jquery
import $ from 'jquery';

import { IUser } from "../interfaces";
import { paginate } from "../tools/pagination";
import { dateFormat } from "../tools/dateFormats";
import { Link, RouteComponentProps } from "react-router-dom";
import jwt from "jsonwebtoken";

interface IPropsGlobal {
  token: string;
}
const Admin: React.FC<IPropsGlobal & RouteComponentProps> = props => {
  const [users, saveUsers] = React.useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [userSelected, setUserSelected] = React.useState<number>(-1);

  const decodedToken = React.useMemo(() => {
    const dToken = jwt.decode(props.token);
    if (dToken !== null && typeof dToken !== "string") {
      return dToken;
    }
    return null;
  }, [props.token]);

  //pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const retrieveUsers = () => {
    if (decodedToken!.isAdmin) {
      fetch("http://localhost:8080/api/admin/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token
        }
      }).then(response => {
        if (response.ok) {
          response.json().then((users: IUser[]) => {
            saveUsers(users);
            const totp = Math.ceil(users.length / 10);
            setTotalPages(totp);
          });
        }
      });
    } else props.history.push("/");
  };

  const banUser = (userid: number) => {
    if (decodedToken!.isAdmin) {
      const uId = users.findIndex((u: IUser) => u.id === userid);
      fetch("http://localhost:8080/api/admin/edit/" + userid, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token
        },
        body: JSON.stringify({
          isbanned: users[uId].isbanned === 1 ? 0 : 1
        })
      }).then(response => {
        if (response.ok) {
          response.json().then((user: IUser) => {
            users[uId].isbanned = user.isbanned;
            saveUsers([...users]);
            setCurrentPage(1)
          });
        }
      });
    } else props.history.push("/");
  };

  //Make admin
  const admUser = (userid: number) => {
    if (decodedToken!.isAdmin) {
      const uId = users.findIndex((u: IUser) => u.id === userid);
      fetch("http://localhost:8080/api/admin/edit/" + userid, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token
        },
        body: JSON.stringify({
          isadmin: 1
        })
      }).then(response => {
        if (response.ok) {
          response.json().then((user: IUser) => {
            users[uId].isadmin = user.isadmin
            saveUsers([...users]);
          });
        }
      });
    } else props.history.push("/");
  };

  //Delete user
  const deleteUser = (userid: number) => {
    fetch("http://localhost:8080/api/admin/delete/" + userid, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok)
        response.json().then((_response: any) => {
          const uIndx = users.findIndex(
            (u: IUser) => u.id === userid
          );
          if (uIndx !== -1) users.splice(uIndx, 1);
          saveUsers([...users]);
        });
    });
  };

  const orderByBanned = (array: IUser[]) => {
    array.sort(function(a, b) {
      if (a.username < b.username) {
        return -1;
      }
      if (a.username > b.username) {
        return 1;
      }
      return 0;
    });
    array.sort((a: any, b: any) => b.isadmin - a.isadmin);
    array.sort((a: any, b: any) => b.isbanned - a.isbanned);
  };
  //Get users from api
  React.useEffect(retrieveUsers, []);

  //Modal controls
  React.useEffect(() => {
    $(".butaccept").click(function() {
      $(".modal").removeClass("is-active");
    });
    $(".modal-close, .butclose").click(function() {
      $(".modal").removeClass("is-active");
    });
  }, []);

  //Saving data to delete
  const deleteModal = (userid:number) => {
     $(".modal").addClass("is-active");
     setUserSelected(userid);
  }
  if (!users) return null;


  //Sort by banned users first
  orderByBanned(users);
  return (
    <div>
      {/* Modal delete user */}
      <div className="modal">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Warning!</p>
            <button className="delete modal-close" aria-label="close"></button>
          </header>
          <section className="modal-card-body">
            Do you want to delete this account permanently?
          </section>
          <footer className="modal-card-foot">
            <button className="button is-danger butaccept" aria-label="close" onClick={() => deleteUser(userSelected)}>
              Delete
            </button>
            <button className="button is-dark butclose" aria-label="close">
              Cancel
            </button>
          </footer>
        </div>
      </div>

    <div className="container">
      <div id="top">
        {users.length === 0 && (
          <div
            className="card has-background-dark"
            css={css`
              padding: 10px;
              width: 100% !important;
              background-color: rgb(34, 34, 34) !important;
              margin-bottom: 5px;
              color: rgb(215, 215, 215) !important;
              font-size: 0.8em;
            `}
          >
            User list is empty!
          </div>
        )}
        {users.length > 0 && (
          // Pagination
          <div
            className="card has-background-dark"
            css={css`
              padding: 10px;
              width: 100% !important;
              background-color: rgb(34, 34, 34) !important;
              margin-bottom: 5px;
              color: rgb(215, 215, 215) !important;
              font-size: 0.8em;
            `}
          >
            <div className="columns">
              <div className="column is-one-fifth">
                Showing: {(currentPage - 1) * 10 + 1} -{" "}
                {currentPage === totalPages ? users.length : currentPage * 10}{" "}
                (of:{"  "}
                {users.length})
              </div>
            </div>
          </div>
        )}
        {paginate(users, currentPage, 10).map((u: IUser) => (
          <div
            className={`card ${u.isbanned === 1?'has-background-grey-light':'has-background-dark'}`}
            key={u.id}
            css={css`
              margin-bottom: 5px;
              box-shadow: 3px 3px 11px rgb(0, 0, 0);
              border-radius: 20px;
              color: ${u.isbanned === 0?'rgb(231, 222, 185)':'rgb(25,45,25)'};
              border: ${u.isadmin === 1?'1px solid rgb(205,205,205) !important':''};
            `}
          >
            <div
              className="card-content"
              css={css`
                padding: 5px !important;
              `}
            >
              <div className="columns is-tablet">
                <div className="column is-1">
                  <div
                    css={css`
                      display: flex;
                      justify-content: center;
                    `}
                  >
                    <Link to={`/profile/${u.id}`}>
                      <figure className="image">
                        <img
                          css={css`
                            max-width: 32px !important;
                            ${u.isbanned === 1 ? "filter:grayscale(100);" : ""}
                          `}
                          src={require("../img/" + u.profile_avatar)}
                        />
                      </figure>
                    </Link>
                  </div>
                </div>
                <div className="column is-1">
                  <div>
                  {u.isadmin === 1 && <i className="fas fa-shield-alt"></i>}
                  </div>
                  <div>
                  <span className="is-size-7 has-text-weight-bold">{u.isbanned?'Banned':''}</span>
                  </div>
                </div>
                <div className="column is-2">
                  <h5
                    className="is-subtitle has-text-light is-inline"
                    css={css`
                      margin-bottom: 0px !important;
                      ${u.isbanned === 1
                        ? "color:rgb(255,20,50) !important;"
                        : ""}
                    `}
                  >
                    <i>{u.username}</i>
                  </h5>
                </div>
                <div className="column is-3">
                  <span className="is-size-7">{u.email}</span>
                </div>
                <div className="column is-2">
                  <span className="is-size-7">
                    {dateFormat(u.regdate, true)}
                  </span>
                </div>
                <div className="column is-3">
                  <div
                    className="field"
                    css={css`
                      display: flex !important;
                      justify-content: flex-end !important;
                      margin: 5px;
                    `}
                  >
                      {u.isadmin === 0 && (
                        <div className="buttons">
                      <button
                        onClick={() => banUser(u.id)}
                        className={`button is-rounded is-small ${
                          u.isbanned === 1 ? "is-link" : "is-warning"
                        }`}
                        disabled={u.isadmin ? true : false}
                      >
                        {u.isbanned === 1 ? "Unban" : "Ban"}
                      </button>
                      <button
                        onClick={() => admUser(u.id)}
                        className={`button ${u.isbanned === 1?'is-dark':'is-success'} is-rounded is-small is-outlined`}
                        disabled={u.isbanned === 1?true:false}
                      >
                        Admin
                      </button>
                      <button
                        onClick={() => deleteModal(u.id)}
                        className="button is-danger is-rounded is-small is-outlined"
                      >
                        Delete
                      </button>
                    </div>
                      )}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {totalPages > 1 && (
          // Pagination
          <div
            className="card has-background-dark"
            css={css`
              padding: 10px;
              width: 100% !important;
              background-color: rgb(34, 34, 34) !important;
              margin-top: 10px;
              color: rgb(215, 215, 215) !important;
              font-size: 0.8em;
            `}
          >
            <div className="columns">
              <div className="column">
                {/* Paginate */}
                {totalPages > 1 && (
                  <div className="has-text-right">
                    {currentPage > 1 && (
                      <a
                        href="#top"
                        onClick={prevPage}
                        css={css`
                          margin-right: 5px;
                        `}
                      >
                        <i className="fas fa-chevron-left has-text-light" />
                      </a>
                    )}
                    {currentPage > 1 && (
                      <a
                        href="#top"
                        css={css`
                          font-size: 0.8em;
                        `}
                        onClick={() => setCurrentPage(1)}
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
                      {currentPage}
                    </span>
                    {currentPage !== totalPages && (
                      <a
                        href="#top"
                        css={css`
                          font-size: 0.8em;
                        `}
                        className="has-text-light"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </a>
                    )}
                    {currentPage !== totalPages && (
                      <a
                        href="#top"
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
)(Admin);
