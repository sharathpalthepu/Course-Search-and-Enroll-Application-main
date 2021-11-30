import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Rate from "./Rate";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";

import "./App.css";

class RecCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    return <div>{this.getRecommendedCourses()}</div>;
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  getRecommendedCourses() {
    var recommended = [];
    recommended.push(
      <Card style={{ width: "33%", marginTop: "5px", marginBottom: "5px" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ maxWidth: 250 }}>{this.props.courseInfo.name}</div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {this.props.courseInfo.number} - {this.props.courseInfo.credits}{" "}
            Credits
          </Card.Subtitle>
          {this.getDescription()}
        </Card.Body>
      </Card>
    );

    return recommended;
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

  getDescription(i) {
    if (this.state.expanded) {
      return <div>{this.props.courseInfo.description}</div>;
    }
  }
}

export default RecCourse;
