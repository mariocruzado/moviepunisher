import React from "react";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers/global";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { RouteComponentProps, Link } from "react-router-dom";

//Own scripts
import {
  reviewContentChecker,
  reviewTitleChecker
} from "../tools/fieldChecker";

interface IPropsGlobal {
  token: string;
}

interface OwnProps {
  review_id: number;
  rlist: any[];

  close_edit: () => void;
}

const EditReview: React.FC<IPropsGlobal & OwnProps> = props => {
  const [reviewData, saveReviewData] = React.useState<any>({});

  //States for form controls
  const [reviewTitle, setReviewTitle] = React.useState("");
  const [reviewContent, setReviewContent] = React.useState("");
  const [rating, setRating] = React.useState();

  const [label, setLabel] = React.useState(false);

  //Form updaters
  const updateReviewTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !(event.currentTarget.value.charAt(0) === " ") &&
      event.currentTarget.value.length < 51
    ) {
      setReviewTitle(event.currentTarget.value);
    }
  };

  const updateReviewContent = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (
      !(event.currentTarget.value.charAt(0) === " ") &&
      event.currentTarget.value.length < 1501
    ) {
      setReviewContent(event.currentTarget.value);
      setLabel(false);
    }
  };

  const updateRating = (event: React.ChangeEvent<any>) => {
    setRating(event.currentTarget.value);
  };

  //Get data by review id searching in reviews array (Fetch not needed)
  const getReviewData = (reviewid: number) => {
    const indexReview = props.rlist.find((r: any) => r.id === reviewid);
    saveReviewData(indexReview);
    setRating(indexReview.rating);
    setReviewContent(indexReview.content);
    setReviewTitle(indexReview.title);
  };

  //Function to update review array
  const updateReviewArray = (reviewid: number, nReview: any) => {
    const rToChange = props.rlist.findIndex((r: any) => r.id === reviewid);
    props.rlist[rToChange] = nReview;
  };

  //Field checker to enable button
  const reviewFieldChecker = () => {
    let res = false;
    if (reviewContentChecker(reviewContent) && reviewTitleChecker(reviewTitle))
      res = true;
    return res;
  };

  //Updating the review (Button onclick function)
  const updateReview = (reviewid: number) => {
    if (reviewFieldChecker()) {
      fetch("http://localhost:8080/api/reviews/" + reviewid, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token
        },
        body: JSON.stringify({
          rating: rating,
          content: reviewContent
        })
      }).then(response => {
        if (response.ok)
          response.json().then((review: any) => {
            updateReviewArray(review.id, review);
            props.close_edit();
          });
      });
    } else {
      setLabel(true);
    }
  };

  //Get data to fill the form
  React.useEffect(() => getReviewData(props.review_id), [props.review_id]);

  //Rendering
  return (
    <div className="box">
      <div className="control field">
        <div className="columns">
          <div className="column is-2">
            <span>Title: </span>
          </div>
          <div className="column is-10">
            <input
              type="text"
              className="input is-rounded"
              value={reviewTitle}
              onChange={updateReviewTitle}
              disabled
            />
          </div>
        </div>
        <div className="columns">
          <div className="column is-2">
            <span>Rating: </span>
          </div>
          <div className="column is-10">
            <div className="control">
              <div className="select is-rounded">
                <select value={rating} onChange={updateRating}>
                  <option value="1">Terrible</option>
                  <option value="2">Bad</option>
                  <option value="3">Regular</option>
                  <option value="4">Good</option>
                  <option value="5">Excellent</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="control field">
          <div className="columns">
            <div className="column is-2">
              <span>Content: </span>
            </div>
            <div className="column is-10">
              <textarea
                value={reviewContent}
                onChange={updateReviewContent}
                className={`textarea is-small has-fixed-size ${
                  label ? "is-danger" : ""
                }`}
                placeholder="*Enter 100-500 characters"
                css={css`
                  width: 100%;
                `}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="field">
          <div className="control buttons">
            <button
              onClick={() => updateReview(props.review_id)}
              className="button"
            >
              Update
            </button>
            <button className="button is-danger" onClick={props.close_edit}>
              {"Back to reviews"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//Redux
const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token
});
export default connect(
  mapStateToProps,
  null
)(EditReview);
