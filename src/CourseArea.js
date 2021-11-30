import React from "react";
import "./App.css";
import Course from "./Course";
import CompCourse from "./CompCourse";
import RecCourse from "./RecCourse";

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];
    let coursesAdded = [];

    if (!this.props.cartMode) {
      if (this.props.recMode === true) {
        var sub;
        // loop through rating array, then have inner for loop to loop through allcourses
        // then in the inner for loop you find the course that has the same course num as the one in rating array
        // check if rating of that course is larger than 4, if it is then keep a variable to keep track of current subject
        for (let i = 0; i < this.props.findRatings.length; i++) {
          if (
            this.props.findRatings[i].rating >= 4 &&
            this.props.findRatings[i].rating != "No Rating"
          ) {
            for (let j = 0; j < this.props.subdata.length; j++) {
              if (
                this.props.subdata[j].number ===
                this.props.findRatings[i].courseNum
              ) {
                sub = this.props.subdata[j].subject;

                for (let k = 0; k < this.props.subdata.length; k++) {
                  if (this.props.subdata[k].subject === sub) {
                    if (this.props.subdata[j] !== this.props.subdata[k]) {
                      if (
                        !coursesAdded.includes(this.props.subdata[k].number) &&
                        !this.props.data.data.includes(
                          this.props.subdata[k].number
                        )
                      ) {
                        courses.push(
                          <RecCourse
                            courseNums={this.props.subdata[k].number}
                            courseInfo={this.props.subdata[k]}
                            compCourses={this.props.data.data}
                            allCourses={this.props.subdata}
                            ratings={this.props.findRatings}
                          />
                        );

                        coursesAdded.push(this.props.subdata[k].number);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (this.props.compMode === true) {
        for (let i = 0; i < this.props.subdata.length; i++) {
          if (this.props.data.data.includes(this.props.subdata[i].number)) {
            courses.push(
              <CompCourse
                data={this.props.subdata[i]}
                key={this.props.subdata[i].name}
                updateRating={this.props.updateRating}
                ratings={this.props.findRatings}
              />
            );
          }
        }
      } else {
        for (let i = 0; i < this.props.data.length; i++) {
          courses.push(
            <Course
              key={"course_" + i}
              data={this.props.data[i]}
              courseKey={this.props.data[i].number}
              addCartCourse={(data) => this.props.addCartCourse(data)}
              removeCartCourse={(data) => this.props.removeCartCourse(data)}
              cartCourses={this.props.cartCourses}
              compCourses={this.props.compCourses}
            />
          );
        }
      }
    } else {
      for (let i = 0; i < this.props.data.length; i++) {
        courses.push(
          <Course
            key={"cartItem_" + this.props.data[i].number}
            data={this.props.data[i]}
            courseKey={this.props.data[i].number}
            addCartCourse={(data) => this.props.addCartCourse(data)}
            removeCartCourse={(data) => this.props.removeCartCourse(data)}
            cartCourses={this.props.cartCourses}
            compCourses={this.props.compCourses}
          />
        );
      }
    }

    return courses;
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(this.props) !== JSON.stringify(nextProps);
  }

  render() {
    return <div style={{ margin: 5, marginTop: -5 }}>{this.getCourses()}</div>;
  }
}

export default CourseArea;
