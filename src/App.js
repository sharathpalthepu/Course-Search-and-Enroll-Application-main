import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import uwlogo from "../src/uwlogo.png";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      interests: [],
      cartCourses: {},
      compCourses: [],
      ratings: [{}],
      showSearch: true,
      showCart: false,
      showCompCourse: false,
      showRecCourse: false,
    };
  }

  componentDidMount() {
    this.loadInitialState();
  }

  async loadInitialState() {
    let courseURL = "https://cs571.cs.wisc.edu/api/react/classes";
    let courseData = await (await fetch(courseURL)).json();
    let compURL =
      "https://cs571.cs.wisc.edu/api/react/students/5022025924/classes/completed";
    let compData = await (await fetch(compURL)).json();

    this.setState({
      allCourses: courseData,
      filteredCourses: courseData,
      subjects: this.getSubjects(courseData),
      interests: this.getKeywords(courseData),
      compCourses: compData,
    });
  }

  updateRating(courseNum, rating) {
    console.log(rating);
    var temp = JSON.parse(JSON.stringify(this.state.ratings));
    //var remove = this.state.ratings.indexOf(rating);
    // if (rating < 4) {
    //   this.setState({
    //     ratings: this.state.ratings.splice(remove, 1),
    //   });
    // }
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].courseNum == courseNum) {
        temp[i].rating = rating;
        this.setState({
          ratings: temp,
        });
        return;
      }
    }
    this.setState({
      ratings: this.state.ratings.concat({
        courseNum: courseNum,
        rating: rating,
      }),
    });
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (let i = 0; i < data.length; i++) {
      if (subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  getKeywords(data) {
    let interests = [];
    interests.push("All");

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].keywords.length; j++) {
        //console.log(data[i].keywords[j]);
        if (interests.indexOf(data[i].keywords[j]) === -1)
          interests.push(data[i].keywords[j]);
      }
    }
    return interests;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses)); // I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {
      return x.number === data.course;
    });
    if (courseIndex === -1) {
      return;
    }

    if ("subsection" in data) {
      if (data.course in this.state.cartCourses) {
        if (data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        } else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    } else if ("section" in data) {
      if (data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      }
    } else {
      newCartCourses[data.course] = {};

      for (
        let i = 0;
        i < this.state.allCourses[courseIndex].sections.length;
        i++
      ) {
        newCartCourses[data.course][i] = [];

        for (
          let c = 0;
          c < this.state.allCourses[courseIndex].sections[i].subsections.length;
          c++
        ) {
          newCartCourses[data.course][i].push(
            this.state.allCourses[courseIndex].sections[i].subsections[c]
          );
        }
      }
    }
    this.setState({ cartCourses: newCartCourses });
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses));

    if ("subsection" in data) {
      newCartCourses[data.course][data.section].forEach((_subsection) => {
        if (_subsection.number === data.subsection.number) {
          newCartCourses[data.course][data.section].splice(
            newCartCourses[data.course][data.section].indexOf(_subsection),
            1
          );
        }
      });
      if (newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else if ("section" in data) {
      delete newCartCourses[data.course][data.section];
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else {
      delete newCartCourses[data.course];
    }
    this.setState({ cartCourses: newCartCourses });
  }

  getCartData() {
    let cartData = [];

    for (const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {
        return x.number === courseKey;
      });

      cartData.push(course);
    }
    return cartData;
  }

  render() {
    return (
      <>
        <nav
          class="navbar navbar-expand-lg navbar-light"
          style={{ backgroundColor: "#e85656" }}
        >
          <div class="container-fluid">
            <img src={uwlogo} alt="" width="140"></img>
            <pre> </pre>
            <a class="navbar-brand" href="#">
              Course Search & Enroll
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">
                    <button
                      style={{ backgroundColor: "transparent", borderWidth: 0 }}
                      onClick={() =>
                        this.setState({
                          showSearch: true,
                          showCart: false,
                          showCompCourse: false,
                          showRecCourse: false,
                        })
                      }
                    >
                      Search
                    </button>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <button
                      style={{ backgroundColor: "transparent", borderWidth: 0 }}
                      onClick={() =>
                        this.setState({
                          showSearch: false,
                          showCart: true,
                          showCompCourse: false,
                          showRecCourse: false,
                        })
                      }
                    >
                      Cart
                    </button>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <button
                      style={{ backgroundColor: "transparent", borderWidth: 0 }}
                      onClick={() =>
                        this.setState({
                          showSearch: false,
                          showCart: false,
                          showCompCourse: true,
                          showRecCourse: false,
                        })
                      }
                    >
                      Completed Courses
                    </button>
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">
                    <button
                      style={{ backgroundColor: "transparent", borderWidth: 0 }}
                      onClick={() =>
                        this.setState({
                          showSearch: false,
                          showCart: false,
                          showCompCourse: false,
                          showRecCourse: true,
                        })
                      }
                    >
                      Recommended Courses
                    </button>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div
          defaultActiveKey="search"
          style={{
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <div
            style={{
              paddingTop: "10vh",
              display: this.state.showSearch ? "block" : "none",
            }}
          >
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
              interests={this.state.interests}
            />
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.filteredCourses}
                cartMode={false}
                recMode={false}
                compMode={false}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
                compCourses={this.state.compCourses}
              />
            </div>
          </div>
          <div
            class="overflow-auto"
            style={{
              paddingTop: "10vh",
              display: this.state.showCart ? "block" : "none",
            }}
          >
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.getCartData()}
                cartMode={true}
                recMode={false}
                compMode={false}
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
                compCourses={this.state.compCourses}
              />
            </div>
          </div>
          <div
            class="overflow-auto"
            style={{
              paddingTop: "10vh",
              display: this.state.showCompCourse ? "block" : "none",
            }}
          >
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.compCourses}
                subdata={this.state.allCourses}
                compMode={true}
                recMode={false}
                cartMode={false}
                cartCourses={this.state.cartCourses}
                updateRating={this.updateRating.bind(this)}
              />
            </div>
          </div>
          <div
            class="overflow-auto"
            style={{
              paddingTop: "10vh",
              display: this.state.showRecCourse ? "block" : "none",
            }}
          >
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.compCourses}
                subdata={this.state.allCourses}
                findRatings={this.state.ratings}
                recMode={true}
                compMode={false}
                cartMode={false}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
