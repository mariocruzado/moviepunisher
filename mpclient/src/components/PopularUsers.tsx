import React from "react";
import { IGlobalState } from "../reducers/global";
import { connect } from "react-redux";
import { IUser } from '../interfaces';
import { dateFormat } from '../tools/dateFormats';

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Link } from "react-router-dom";

interface IPropsGlobal {
  token: string;
}
const PopularUsers: React.FC<IPropsGlobal> = props => {
  const [users, saveUsers] = React.useState<any | IUser[] | null>([]);
  const [ready, setReady] = React.useState<boolean>(false);

  React.useEffect(() => retrieveUsers(), []);
  const retrieveUsers = () => {
    fetch("http://localhost:8080/api/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((users: IUser[]) => {
          saveUsers(users.splice(0,10));
          setReady(true);
        });
      }
    });
  };
  if (!ready) return null;

  return (
    <div className="columns is-centered">
          <div className="column">
        <div className="container">
          <table className="table"
          css={css`width:100%;border-radius:15px !important;background-color:rgba(200,200,200,0.5) !important`}
          >
            <thead>
              <tr css={css`font-size:0.75em;`}>
                <th colSpan={5}>#Top Reviewers</th>
              </tr>
            </thead>
            <tbody>
                {users.map((u:IUser, n:number) => (
              <tr key={u.id} className={n > 2?'has-background-light':''}>
              <td className="has-text-centered" css={css`padding:20px`}>
                  <figure className="image is-32x32">
                  <img src={require(`../img/${u.profile_avatar}`)} />
                  </figure>
                  </td>
              <td><Link to={`/profile/${u.id}`} className={n < 3?'has-text-weight-bold':''}>{u.username}</Link></td>
              <td>{dateFormat(u.regdate,false)}</td>
              <td>{u.reviews}</td>
            </tr>
                ))}
            </tbody>
            <tfoot>

                <tr><td colSpan={5} className="is-size-7 has-text-weight-bold" css={css`text-align:right !important;`}>#KeepReviewing</td></tr>
            </tfoot>
          </table>
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
)(PopularUsers);
