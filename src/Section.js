import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import "./App.css";
import Subsection from "./Subsection";

class Section extends React.Component {
  render() {
    return (
      <Accordion.Item
        key={this.props.sectionKey}
        eventKey={this.props.sectionKey}
      >
        <Accordion.Header
          variant="link"
          style={{ height: 63, display: "flex", alignItems: "center" }}
        >
          {"Section " + this.props.sectionKey}
          {this.getSectionButton(this.props.sectionKey)}
        </Accordion.Header>
        <Accordion.Body>
          <Card.Body>
            {JSON.stringify(this.props.data.time)}
            {this.getSubsections()}
          </Card.Body>
        </Accordion.Body>
      </Accordion.Item>
    );
  }

  getSubsections() {
    let subsections = [];

    for (let i = 0; i < this.props.data.subsections.length; i++) {
      subsections.push(
        <Subsection
          key={this.props.data.subsections[i].number}
          data={this.props.data.subsections[i]}
          addCartCourse={this.props.addCartCourse}
          removeCartCourse={this.props.removeCartCourse}
          compCourses={this.props.compCourses}
          requisites={this.props.requisites}
          cartCourses={this.props.cartCourses}
          courseKey={this.props.courseKey}
          sectionKey={this.props.sectionKey}
          subsectionKey={i}
        />
      );
    }

    return <Accordion defaultActiveKey="0">{subsections}</Accordion>;
  }

  getSectionButton(section) {
    let buttonVariant = "danger";
    let buttonOnClick = (e) => this.addSection(e, section);
    let buttonText = "Add Section";

    if (this.props.courseKey in this.props.cartCourses) {
      if (section in this.props.cartCourses[this.props.courseKey]) {
        buttonVariant = "outline-danger";
        buttonOnClick = (e) => this.removeSection(e, section);
        buttonText = "Remove Section";
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

  addSection(e, section) {
    this.displayAlert();
    e.stopPropagation();
    this.props.addCartCourse({
      course: this.props.courseKey,
      section: section,
    });
  }

  removeSection(e, section) {
    e.stopPropagation();
    this.props.removeCartCourse({
      course: this.props.courseKey,
      section: section,
    });
  }
}

export default Section;
