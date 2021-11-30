import React from "react";
import Form from "react-bootstrap/Form";
import RecCourse from "./RecCourse";

class Rate extends React.Component {
  constructor(props) {
    super(props);
    this.rating = React.createRef();
    this.state = {
      rating: "No Rating",
      ratingOptions: ["No Rating", "1", "2", "3", "4", "5"],
    };
  }

  getRatingOptions() {
    let ratingOptions = [];
    ratingOptions.push("No Rating");

    for (const rating of this.state.ratingOptions) {
      ratingOptions.push(<option key={rating}>{rating}</option>);
    }

    return ratingOptions;
  }

  checkRating() {
    //if (this.rating.current.value != "No Rating")
    this.props.updateRating(this.props.courseNum, this.rating.current.value);
  }

  render() {
    return (
      <div>
        <Form.Group controlId="formSubject">
          <Form.Control
            as="select"
            ref={this.rating}
            onChange={() => this.checkRating()}
          >
            {this.getRatingOptions()}
          </Form.Control>
        </Form.Group>
      </div>
    );
  }
}
export default Rate;
