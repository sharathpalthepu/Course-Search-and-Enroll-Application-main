import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";

import "./App.css";
import Section from "./Section";

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,
    };
  }

  render() {
    return (
      <Card style={{ width: "33%", marginTop: "5px", marginBottom: "5px" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ maxWidth: 250 }}>{this.props.data.name}</div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {this.props.data.number} - {this.getCredits()}
          </Card.Subtitle>
          {this.getDescription()}
          <Button variant="danger" onClick={() => this.openModal()}>
            View sections
          </Button>
        </Card.Body>
        <Modal
          show={this.state.showModal}
          onHide={() => this.closeModal()}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.data.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.getSections()}</Modal.Body>
          <Modal.Footer>
            {this.getCourseButton()}
            <Button variant="danger" onClick={() => this.closeModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    );
  }

  getCourseButton() {
    let buttonVariant = "danger";
    let buttonOnClick = () => this.addCourse();
    let buttonText = "Add Course";

    if (this.props.courseKey in this.props.cartCourses) {
      buttonVariant = "outline-danger";
      buttonOnClick = () => this.removeCourse();
      buttonText = "Remove Course";
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>
    );
  }

  getSections() {
    let sections = [];

    for (let i = 0; i < this.props.data.sections.length; i++) {
      sections.push(
        <Section
          key={this.props.data.number + i}
          data={this.props.data.sections[i]}
          addCartCourse={this.props.addCartCourse}
          removeCartCourse={this.props.removeCartCourse}
          compCourses={this.props.compCourses}
          requisites={this.props.data.requisites}
          cartCourses={this.props.cartCourses}
          courseKey={this.props.courseKey}
          sectionKey={i}
        />
      );
    }

    return <Accordion defaultActiveKey="0">{sections}</Accordion>;
  }

  displayAlert() {
    for (let i = 0; i < this.props.compCourses.data.length; i++) {
      for (let j = 0; j < this.props.data.requisites.length; j++) {
        if (!this.props.compCourses.data.includes(this.props.data.number)) {
          if (
            this.props.compCourses.data.indexOf(
              this.props.data.requisites[j]
            ) != -1
          ) {
            if (this.props.data.requisites[j + 1] != undefined) {
              if (
                !this.props.compCourses.data.includes(
                  this.props.data.requisites[j + 1]
                )
              ) {
                alert("You have not taken one or more of the requisites!");
                return;
              }
            }
          }
          for (let k = 0; k < this.props.data.requisites[j].length; k++) {
            if (
              !this.props.compCourses.data.includes(
                this.props.data.requisites[j][k]
              )
            ) {
              console.log("inside");
              alert("You have not taken one or more of the requisites!");
              return;
            }
          }
        }
      }
    }
  }

  addCourse() {
    this.displayAlert();
    this.props.addCartCourse({
      course: this.props.courseKey,
    });
  }

  removeCourse() {
    this.props.removeCartCourse({
      course: this.props.courseKey,
    });
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
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
        variant="outline-danger"
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

  getCredits() {
    if (this.props.data.credits === 1) return "1 credit";
    else return this.props.data.credits + " credits";
  }
}

export default Course;
