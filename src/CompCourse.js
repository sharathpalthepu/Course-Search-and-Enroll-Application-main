import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rate from "./Rate";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";

import "./App.css";

class CompCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    return <div>{this.getCompletedCourses()}</div>;
  }

  getCompletedCourses() {
    var completed = [];
    completed.push(
      <Card style={{ width: "33%", marginTop: "5px", marginBottom: "5px" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ maxWidth: 250 }}>{this.props.data.name}</div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {this.props.data.number} - {this.props.data.credits} Credits
          </Card.Subtitle>
          <Rate
            ratings={this.props.ratings}
            courseNum={this.props.data.number}
            updateRating={this.props.updateRating}
          ></Rate>
          {this.getDescription()}
        </Card.Body>
      </Card>
    );
    return completed;
  }

  setExpanded(value) {
    this.setState({ expanded: value });
  }

  getExpansionButton() {
    let buttonText = "▼";
    let buttonOnClick = () => this.setExpanded(true);

    if (this.state.expanded) {
      buttonText = "▲";
      buttonOnClick = () => this.setExpanded(false);
    }

    return (
      <Button
        variant="outline-dark"
        style={{
          width: 25,
          height: 25,
          fontSize: 12,
          padding: 0,
          position: "absolute",
          right: 20,
          top: 20,
        }}
        onClick={buttonOnClick}
      >
        {buttonText}
      </Button>
    );
  }

  getDescription() {
    if (this.state.expanded) {
      return <div>{this.props.data.description}</div>;
    }
  }
}

export default CompCourse;
