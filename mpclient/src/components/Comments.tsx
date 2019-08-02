import React from "react";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers/global";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { dateFormat } from "../tools/dateFormats";
import jwt from "jsonwebtoken";
import { commentChecker } from "../tools/fieldChecker";

interface IPropsGlobal {
  token: string;
}
const Comments: React.FC<IPropsGlobal & any> = props => {
  const [comments, saveComments] = React.useState<any>([]);
  const [displayComments, setDisplayComments] = React.useState(false);

  const [comment, setComment] = React.useState("");
  const [label, setLabel] = React.useState(false);

  const updateComment = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (
      !(event.currentTarget.value.charAt(0) === " ") &&
      event.currentTarget.value.length < 201
    ) {
      setComment(event.currentTarget.value);
      setLabel(false);
    }
  };

  const decodedToken = React.useMemo(() => {
    const dToken = jwt.decode(props.token);
    if (dToken !== null && typeof dToken !== "string") {
      return dToken;
    }
    return null;
  }, [props.token]);

  //Hide/Show comments
  const switchDisplayC = () => {
    setDisplayComments(!displayComments);
  };

  //Get comments list
  const retrieveComments = (commentid: number) => {
    fetch(`http://localhost:8080/api/comments/review/${commentid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((comments: any) => {
          saveComments(comments);
        });
      }
    });
  };

  //Delete A Comment
  const deleteComment = (commentid: number) => {
    fetch(`http://localhost:8080/api/comments/${commentid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      }
    }).then(response => {
      if (response.ok) {
        response.json().then((comment: any) => {
          const cIndex = comments.findIndex(
            (c: any) => c.id === comment.comment
          );
          if (cIndex !== -1) comments.splice(cIndex, 1);
          saveComments([...comments]);
        });
      }
    });
  };

  const addComment = (review_id: number, content: string) => {
    if (commentChecker(content) && decodedToken && review_id) {
      const comment = {
        user_id: decodedToken!.id,
        comment: content
      };
      console.log(props.token);
      fetch(`http://localhost:8080/api/comments/new/${review_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token
        },
        body: JSON.stringify(comment)
      }).then(response => {
        if (response.ok) {
          response.json().then((comment: any) => {
            comments.push(comment);
            saveComments([...comments]);
            setComment("");
          });
        }
      });
    } else {
      setLabel(true);
    }
  };

  React.useEffect(() => retrieveComments(props.review_id), []);

  return (
    <div>
      {!displayComments && (
        <a className="has-text-info is-size-7" onClick={switchDisplayC}>
          {comments.length > 0
            ? `Comments (${comments.length})`
            : `Add Comment`}
        </a>
      )}

      {displayComments && (
        <div>
          <hr />
          {comments.map((c: any) => (
            <div
              className="columns"
              css={css`
                padding: 10px !important;
                border-radius: 0px;
              `}
              key={c.id}
            >
              <div className="column is-1">
                <div
                  css={css`
                    width: 24px;
                  `}
                  className="is-pulled-right"
                >
                  <img src={require("../img/" + c.profile_avatar)} />
                </div>
              </div>
              <div className="media-content">
                <div className="content">
                  <div
                    className="box"
                    css={css`
                      padding: 5px;
                      padding-left: 10px;
                    `}
                  >
                    <div
                      css={css`
                        margin-right: 10px;
                        display: inline;
                      `}
                    >
                      <strong className="is-size-6">{c.user_username}</strong>
                    </div>
                    <span
                      css={css`
                        font-size: 0.8em;
                      `}
                    >
                      {c.content}
                    </span>
                    <br />
                    <div className="has-text-right">
                      <small
                        css={css`
                          margin-right: 15px;
                          font-size: 0.65em;
                        `}
                      >
                        {dateFormat(c!.date, true)}
                      </small>
                      {(decodedToken!.isAdmin ||
                        c.user_id === decodedToken!.id) && (
                        <a
                          css={css`
                            font-size: 0.8em;
                          `}
                          onClick={() => deleteComment(c.id)}
                          className="has-text-danger is-size-7"
                        >
                          <i className="icon is-small far fa-times-circle" />
                          {" Delete"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* //NEW COMMENT */}
          <article className="media">
            <div className="media-content">
              <div className="field">
                <div className="control">
                  <textarea
                    onChange={updateComment}
                    value={comment}
                    className={`textarea ${label ? "is-danger" : ""}`}
                    placeholder="*Enter 3-200 characters"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button
                    onClick={() => addComment(props.review_id, comment)}
                    className="button"
                    css={css`
                      font-size: 0.78em;
                    `}
                  >
                    <i
                      css={css`
                        margin-right: 5px;
                      `}
                      className="fas fa-plus"
                    />
                    Post comment
                  </button>
                </div>
              </div>
            </div>
          </article>
          {displayComments && (
            <div className="has-text-right">
              <a className="has-text-info is-size-7" onClick={switchDisplayC}>
                {"<"} Hide Comments
              </a>
            </div>
          )}
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
)(Comments);
