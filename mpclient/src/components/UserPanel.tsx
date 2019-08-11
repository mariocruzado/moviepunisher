import React from "react";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers/global";
import { RouteComponentProps, Link } from 'react-router-dom';
import UserDetails from '../components/UserDetails';

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import UserReviews from './UserReviews';

interface IPropsGlobal {
  token: string;
}
const UserPanel: React.FC<
  IPropsGlobal & RouteComponentProps<{ user_id: any }>
> = props => {
  return (
    <div
      css={css`
        border-radius:0px 10px 10px 10px;
      `}
      className="container"
    >
      <div
        css={css`
          margin-bottom: 10px;
        `}
      >
        {" "}
        <Link className="is-dark button" css={css`font-size:0.92em;padding:0px 50px;border-radius:0px 0px 10px 0px !important;`}to={"/"}>
        <i className="fas fa-times-circle is-big has-text-light" />
        </Link>
      </div>
      <UserDetails user_id={props.match.params.user_id}></UserDetails>
      <UserReviews user_id={props.match.params.user_id} />
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token
});

export default connect(
  mapStateToProps,
  null
)(UserPanel);
