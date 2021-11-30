import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

import "./App.css";

class Subsection extends React.Component {
  render() {
    return (
      <Accordion.Item
        key={this.props.subsectionKey}
        eventKey={this.props.subsectionKey}
      >
        <Accordion.Header
          variant="link"
          style={{ height: 63, display: "flex", alignItems: "center" }}
        >
          {this.props.subsectionKey}
          {this.getSubsectionButton(this.props.sectionKey, this.props.data)}
        </Accordion.Header>
        <Accordion.Body>{JSON.stringify(this.props.data.time)}</Accordion.Body>
      </Accordion.Item>
    );
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = "dark";
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = "Add Subsection";

    if (this.props.courseKey in this.props.cartCourses) {
      if (section in this.props.cartCourses[this.props.courseKey]) {
        if (
          this.props.cartCourses[this.props.courseKey][section].some(
            (_subsection) => _subsection.number === subsection.number
          )
        ) {
          buttonVariant = "outline-dark";
          buttonOnClick = (e) => this.removeSubsection(e, section, subsection);
          buttonText = "Remove Subsection";
        }
      }
    }

    return (
      <Button
        as="a"
        variant={buttonVariant}
        onClick={buttonOnClick}
        style={{ position: "absolute", right: 50 }}
      >
        {buttonText}
      </Button>
    );
  }

  displayAlert() {
    for (let i = 0; i < this.props.compCourses.data.length; i++) {
      for (let j = 0; j < this.props.requisites.length; j++) {
        if (!this.props.compCourses.data.includes(this.props.courseKey)) {
          if (
            this.props.compCourses.data.indexOf(this.props.requisites[j]) != -1
          ) {
            if (this.props.requisites[j + 1] != undefined) {
              if (
                !this.props.compCourses.data.includes(
                  this.props.requisites[j + 1]
                )
              ) {
                alert("You have not taken one or more of the requisites!");
                return;
              }
            }
          }
          for (let k = 0; k < this.props.requisites[j].length; k++) {
            if (
              !this.props.compCourses.data.includes(this.props.requisites[j][k])
            ) {
              alert("You have not taken one or more of the requisites!");
              return;
            }
          }
        }
      }
    }
  }

  addSubsection(e, section, subsection) {
    this.displayAlert();
    e.stopPropagation();
    this.props.addCartCourse({
      course: this.props.courseKey,
      section: section,
      subsection: subsection,
    });
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse({
      course: this.props.courseKey,
      section: section,
      subsection: subsection,
    });
  }
}

export default Subsection;
