<template>
  <div id="parliament">
    <div id="tooltip">
      <div class="headshot"><img /></div>
      <div class="name"></div>
      <div class="arrangement"></div>
      <div class="order"></div>
    </div>
  </div>
</template>

<script>
import d3 from "../d3-importer.js";
// Load the data
import datasetN from "../data/N_council.json";
import datasetS from "../data/S_council.json";
import arrangements from "../data/arrangements.json";
import selections from "../data/selections.json";

export default {
  props: ["lang"],
  async mounted() {
    await this.checkUrl();
    await this.drawParliament();
    this.updateUrl();
  },
  data() {
    return {
      council: null,
      dataset: null,
      arrangements,
      selections,
      language: "de",
      selectedCouncil: null,
      selectedArrangement: null,
      selectedOrder: null,
    };
  },
  watch: {
    lang(newLanguage) {
      this.language = newLanguage;
      this.updateUrl()
      this.drawParliament();
    },
  },
  methods: {
    updateUrl() {
      history.pushState(
        {},
        null,
        `${this.$route.path}?council=${this.selectedCouncil}&arr=${this.selectedArrangement}&ord=${this.selectedOrder}&lang=${this.language}`
      )
    },
    async checkUrl() {

      try {
        await this.$router.isReady()
        // onSuccess

        const params = this.$route.query;

        if (params.lang) {
          this.$emit("changeLanguage", params.lang);
        } else {
          this.language = this.lang;
        }

        if (params.arr) {
          this.setDropdownSelection("arrangement", params.arr);
        }

        if (params.ord) {
          this.setDropdownSelection("order", params.ord);
        }

        if (params.council) {
          this.$emit("changeCouncil", params.council);
          this.setDropdownSelection("council", params.council);
        }

      } catch (err) {
        // onError
      }
    },
    setDropdownSelection(id, option) {
      document.getElementById(id).value = option;
    },
    addMetadata() {
      // Add additional data fields to each councillor
      const today = new Date();

      this.dataset.forEach((councillor) => {
        // Get age
        const birthDate = new Date(councillor.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        // Add age
        councillor.age = age;

        // Add age group
        const tens = age.toString()[0];
        Object.keys(this.arrangements.ageGroup).forEach((group) => {
          if (group.startsWith(tens)) {
            councillor.ageGroup = group;
          }
        });

        // Add number of (active) committee memberships
        let nr = 0;
        councillor.committeeMemberships.forEach((ms) => {
          if (!ms.leavingDate) {
            nr++;
          }
        });
        councillor.nrOfCommittees = nr;

        // Add total number of council memberships
        councillor.nrOfCouncilMemberships =
          councillor.councilMemberships.length;

        // Add total number of concerns
        councillor.nrOfConcerns = councillor.concerns.length;

      });
    },
    async drawParliament() {
      // This is currently a big function doing it all

      // These are the things happening: 
      // 1. It calculates extra metadata for the datasets (each time it changes)
      // 2. It creates the initial svg canvas
      // 3. The drawArrangement() function draws the actual seats arrangement into the canvas
      // It needs the outerXDomain, innerXDomain, yDomain, and colorScale for an input
      // 4. There are nested things happening inside drawArrangement():
      // 4.1. createLegend() draws the legend for the seating (based on the selected order)
      // 4.2. .on("change") events listen to changes to the dropdowns and call an updateSeatArrangement() function
      // 4.3. updateSeatArrangement() updates the current seat arrangement and animates it with .transition()

      // All this could be refactored to standalone functions based on the correct selections
      // Also, the updates of the arrangement could be done with the D3.js join() method

      // Remove any previously present svg cancas if necessary - the primitive approach
      d3.select("svg").remove();

      // Get the selected council, arrangement, and order
      ///////////////////////////////////////////////////
      this.selectedCouncil = d3.select("#council").node().value;
      this.selectedArrangement = d3.select("#arrangement").node().value;
      this.selectedOrder = d3.select("#order").node().value;

      // Check council and set dataset
      this.dataset = this.selectedCouncil === "N" ? datasetN : datasetS;

      // Add additional data fields to each councillor
      this.addMetadata();

      // Prepare the initial SVG
      ///////////////////////////////////////////////

      // Set the dimensions
      const dimensions = {
        width: 1000,
        height: 425,
        margins: {
          top: 40,
          right: 118,
          bottom: 30,
          left: 15,
        },
        ctrWidth: null,
        ctrHeight: null,
      };

      // Create and set inner container width
      dimensions.ctrWidth = dimensions.width - (dimensions.margins.left + dimensions.margins.right);
      // Create and set inner container height
      dimensions.ctrHeight = dimensions.height - (dimensions.margins.top + dimensions.margins.bottom * 1.5);

      // Set the max number of seats per seating row (this coorespondes to the number of seats per row without an arrangement)
      const maxSeatsPerRow = this.selectedCouncil === "N" ? 20 : 15

      // Create SVG element
      const svg = d3
        .select("#parliament")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin")
        .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);

      // Add inner container to SVG
      const ctr = svg
        .append("g")
        .attr(
          "transform",
          `translate(${dimensions.margins.left}, ${dimensions.margins.top})`
        );

      // Arrange the seating
      ///////////////////////////////////////////////

      // Function to create the seating
      const drawArrangement = (
        outerXDomain,
        innerXDomain,
        yDomain,
        colorScale
      ) => {
        // Create the actual outer x-scale
        const xScaleOuter = d3
          .scaleBand()
          .domain(outerXDomain)
          .range([0, dimensions.ctrWidth])
          .paddingInner(0.2) // Space between groups of x-axis items
          .paddingOuter(0.2)
          .align(0.5);

        const xScaleInner = d3
          .scaleBand()
          .domain(innerXDomain)
          .range([0, xScaleOuter.bandwidth()])
          .paddingInner(0.2);

        // Create the actual y-scale
        const yScale = d3
          .scaleBand()
          .domain(yDomain)
          .range([0, this.selectedCouncil === "N" ? dimensions.ctrHeight : dimensions.ctrHeight / 2])
          .paddingInner(0.1);

        // Create x-axis
        const xAxis = d3.axisBottom(xScaleOuter).tickSize(0).tickSizeOuter(0);


        // Draw x-axis
        const xAxisLine = ctr
          .append("g")
          .attr("id", "x-axis")
          .attr("transform", `translate(0, ${dimensions.ctrHeight})`)
          .style("font-size", this.selectedArrangement === "nrOfConcerns" ? "0.6em" : "0.9em")
          .call(xAxis);

        // Rotate axis tick labels
        if (this.selectedArrangement === "party") {
          xAxisLine
            .selectAll("text")
            .transition()
            .duration(1000)
            .style("text-anchor", "start")
            .attr("dy", "-.01em")
            .attr("dx", "-2em")
            .attr("transform", "rotate(-90)");
        }

        // Remove the horizontal x-axis line
        xAxisLine.call((axis) => axis.select(".domain").remove());

        // Add x-axis label
        ctr
          .append("g")
          .attr(
            "transform",
            `translate(${dimensions.ctrWidth / 2}, ${dimensions.ctrHeight + dimensions.margins.bottom + 12})`
          )
          .attr("id", "x-axis-label")
          .append("text")
          .style("font-size", "1em")
          .style("font-weight", "bold")
          .attr("text-anchor", "middle")
          .text(() => {
            if (this.selectedArrangement !== "firstName") {
              return selections[this.selectedArrangement][this.language];
            } else {
              return "";
            }
          });

        const seatsGroup = ctr.append("g").attr("class", "seats");

        // Get tooltip element from DOM
        const tooltip = d3.select("#tooltip");

        seatsGroup
          .selectAll("g")
          .data(this.dataset)
          .join("g")
          .attr("class", "seat")
          .attr("transform", (d) => {
            if (
              !this.arrangements[this.selectedArrangement] &&
              this.selectedArrangement !== "firstName"
            ) {
              // It's numerical
              return `translate(${+xScaleOuter(d[this.selectedArrangement])}, 0)`;
            } else {
              if (this.selectedArrangement === "firstName") {
                return `translate(${+xScaleOuter("")}, 0)`;
              } else {
                return `translate(${+xScaleOuter(
                  this.arrangements[this.selectedArrangement][d[this.selectedArrangement]][this.language]
                )}, 0)`;
              }
            }
          }) // Position along the main x-axis
          .attr("id", (d) => d.id)
          .append("a")
          .attr(
            "xlink:href",
            (d) =>
              `https://www.parlament.ch/${this.language}/biografie/${d.firstName}-${d.lastName}/${d.id}`
          )
          .attr("target", "_blank")
          .append("circle")
          .attr("class", "councillor")
          .attr("cx", (d) => {
            // Get index of inner Scale
            const iIdx = d.innerIdx % innerXDomain.length;
            return xScaleInner(iIdx) + xScaleInner.bandwidth() / 2;
          })
          .attr("cy", (d) => {
            const yIdx = Math.floor(d.innerIdx / innerXDomain.length);
            return yScale(yIdx);
          })
          .attr("r", () => {
            let r = xScaleInner.bandwidth() / 2;
            if (yScale.bandwidth() / 2 < r) {
              r = yScale.bandwidth() / 2;
            }
            return r;
          })
          .attr("fill", (d) => {
            if (!this.arrangements[this.selectedOrder] && this.selectedOrder !== "firstName" && this.selectedOrder !== "age") {
              return colorScale(d[this.selectedOrder]);
            } else {
              if (this.selectedOrder === "firstName") {
                return this.arrangements.party[d.party].color;
              } else if (this.selectedOrder === "age") {
                return this.arrangements.ageGroup[d.ageGroup].color;
              }
              else {
                return this.arrangements[this.selectedOrder][d[this.selectedOrder]].color;
              }
            }
          })
          .on("mouseover touchstart", (_, datum) => {
            addMouseover(datum);
          })
          .on("mouseout touchend", () => {
            tooltip.style("display", "none");
          })
          .attr("cursor", "pointer")
          .attr("opacity", 0)
          .transition()
          .duration(2500)
          .attr("opacity", 1);

        const addMouseover = (data) => {

          tooltip.style("display", "block");

          onmousemove = (e) => {
            tooltip
              .style("left", e.clientX + 25 + "px")
              .style("top", e.clientY - 50 + "px");
          };

          tooltip.select(".headshot img")
            .attr("src", `https://www.parlament.ch/sitecollectionimages/profil/portrait-260/${data.number}.jpg`);

          tooltip.select(".name").text(`${data.firstName} ${data.lastName}`);

          tooltip.select(".arrangement").text(() => {
            if (
              !this.arrangements[this.selectedArrangement] &&
              this.selectedArrangement !== "firstName"
            ) {
              return `${data[this.selectedArrangement]}`;
            } else {
              if (this.selectedArrangement !== "firstName") {
                return `${this.arrangements[this.selectedArrangement][data[this.selectedArrangement]][
                  this.language
                ]
                  }`;
              } else {
                return `${this.arrangements.party[data.party][this.language]}`;
              }
            }
          });

          if (this.selectedArrangement !== this.selectedOrder) {
            tooltip.select(".order").text(() => {
              if (!this.arrangements[this.selectedOrder] && this.selectedOrder !== "firstName") {
                return `${data[this.selectedOrder]}`;
              } else {
                if (this.selectedOrder !== "firstName") {
                  return `${this.arrangements[this.selectedOrder][data[this.selectedOrder]][this.language]
                    }`;
                } else {
                  return `${this.arrangements.party[data.party][this.language]
                    }`;
                }
              }
            });
          } else {
            tooltip.select(".order").text("");
          }
        };

        // Add legend
        ///////////////////////////////////////////////
        const createLegend = (thisColorScale) => {
          d3.selectAll(".legend").remove();

          let thisOrder = this.selectedOrder !== "firstName" ? this.selectedOrder : "party";

          let legendKeys;

          if (
            !this.arrangements[thisOrder] &&
            thisOrder !== "firstName" &&
            thisOrder !== "age"
          ) {
            // It's numerical
            const max = d3.max(
              this.dataset,
              (councillor) => councillor[thisOrder]
            );
            legendKeys = Array.from(Array(max + 1).keys());

            if (thisOrder === "nrOfCouncilMemberships") {
              legendKeys.shift();
            }
          } else {
            if (this.selectedOrder === "age") {
              thisOrder = "ageGroup";
            }
            // Create legend keys
            legendKeys = Object.keys(this.arrangements[thisOrder]).map(
              (key) => key
            );
          }

          let fct = 1;

          if (thisOrder === "nrOfConcerns" || thisOrder === "cantonName") {
            fct = 0.72;
          }

          const spacingVertical = 20 * fct;
          const circleRadius = spacingVertical / 3;
          const spacingHorizontal = spacingVertical / 2;

          // Add legend group
          const legendGroup = svg
            .append("g")
            .attr("class", "legend")
            .style("font-size", `${circleRadius * 2}`)
            .attr(
              "transform",
              `translate(${dimensions.ctrWidth + 22}, ${dimensions.margins.top
              })`
            );

          // Add legend title
          const shortenTitle = ["nrOfCouncilMemberships", "nrOfCommittees", "nrOfConcerns"];

          const toRemove = {
            "nrOfCouncilMemberships": {
              "de": "Anzahl ",
              "fr": "Nombre de ",
              "it": "Numero dei ",
              "rm": "Dumber ",
              "en": "Number of "
            },
            "nrOfCommittees": {
              "de": "Anzahl ",
              "fr": "Nombre de ",
              "it": "Numero dei ",
              "rm": " (dumber)",
              "en": "Number of "
            },
            "nrOfConcerns": {
              "de": "Anzahl ",
              "fr": "Nombre des ",
              "it": "Numero dei ",
              "rm": " (dumber)",
              "en": "Number of "
            },
          };

          legendGroup
            .append("g")
            .append("text")
            .style("font-weight", "bold")
            .text(() => {
              if (thisOrder !== "firstName") {
                if (shortenTitle.includes(thisOrder)) {
                  let str = selections[thisOrder][this.language].replace(
                    toRemove[thisOrder][this.language],
                    ""
                  );
                  str = str[0].toUpperCase() + str.slice(1);
                  return str;
                } else {
                  return selections[thisOrder][this.language];
                }
              } else {
                return selections.party[this.language];
              }
            })

          // Add <g> for each legend item
          const legendItems = legendGroup
            .selectAll(".legend-item")
            .data(legendKeys)
            .join("g")
            .attr("class", "legend-item")
            .attr(
              "transform",
              (_, i) =>
                `translate(${circleRadius}, ${spacingVertical + i * spacingVertical
                })`
            );

          // Draw the legend circles for selected legend keys
          legendItems
            .append("circle")
            .transition()
            .duration(1000)
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", circleRadius)
            .attr("fill", (d) => {
              if (thisColorScale) {
                return thisColorScale(d);
              } else {
                return this.arrangements[thisOrder][d].color;
              }
            });

          // Write the legend keys next to the legend circles
          legendItems
            .append("text")
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1)
            .attr("x", spacingHorizontal)
            .attr("y", circleRadius / 2 + 1)
            .text((d) => {
              if (thisColorScale) {
                return d;
              } else {
                return this.arrangements[thisOrder][d][this.language];
              }
            });
        };

        createLegend(colorScale)

        // Update general seat arrangement
        ///////////////////////////////////////////////

        // Old approach of updating the chart. I would do it differently now.
        const updateSeatArrangement = (
          newXOuter,
          newXInner,
          newYDomain,
          newColorScale
        ) => {
          const newOuterXScale = xScaleOuter.domain(newXOuter);

          const newInnerXScale = xScaleInner
            .domain(newXInner)
            .range([0, newOuterXScale.bandwidth()]);

          const newYScale = yScale.domain(newYDomain);

          const x = d3.select("#x-axis");
          x.transition()
            .style("font-size", this.selectedArrangement === "nrOfConcerns" ? "0.6em" : "0.9em")
            .duration(1000)
            .call(d3.axisBottom(newOuterXScale).tickSize(0).tickSizeOuter(0));

          // Remove the horizontal x-axis line
          x.call((axis) => axis.select(".domain").remove());

          if (this.selectedArrangement === "party") {
            x.selectAll("text")
              .transition()
              .duration(2000)
              .style("text-anchor", "start")
              .attr("dy", "-.05em")
              .attr("dx", "-1.5em")
              .attr("transform", "rotate(-90)");
          } else if (this.selectedArrangement === "faction") {
            x.selectAll("text")
              .transition()
              .duration(2000)
              .style("text-anchor", "middle")
              .attr("dy", "0")
              .attr("dx", "0")
              .attr("transform", "rotate(0)");
          }

          const xLabel = d3.select("#x-axis-label");
          xLabel
            .select("text")
            .transition()
            .duration(2000)
            .text(() => {
              if (this.selectedArrangement !== "firstName") {
                return selections[this.selectedArrangement][this.language];
              } else {
                return "";
              }
            });

          // Update the position of the seats
          d3.selectAll(".seat")
            .transition()
            .duration(2000)
            .attr("transform", (d) => {
              if (
                !this.arrangements[this.selectedArrangement] &&
                this.selectedArrangement !== "firstName"
              ) {
                // It's numerical
                return `translate(${+newOuterXScale(d[this.selectedArrangement])}, 0)`;
              } else {
                if (this.selectedArrangement === "firstName") {
                  return `translate(${+newOuterXScale("")}, 0)`;
                } else {
                  return `translate(${+newOuterXScale(
                    this.arrangements[this.selectedArrangement][d[this.selectedArrangement]][
                    this.language
                    ]
                  )}, 0)`;
                }
              }
            }); // Position along the main x-axis

          d3.selectAll(".councillor")
            .attr("cursor", "pointer")
            .on("mouseover touchstart", (_, datum) => {
              addMouseover(datum);
            })
            .on("mouseout touchend", () => {
              tooltip.style("display", "none");
            })
            .transition()
            .duration(2000)
            .attr("cx", (d) => {
              // Get index of inner Scale
              const iIdx = d.innerIdx % newXInner.length;
              return newInnerXScale(iIdx) + newInnerXScale.bandwidth() / 2;
            })
            .attr("cy", (d) => {
              const yIdx = Math.floor(d.innerIdx / newXInner.length);
              return newYScale(yIdx);
            })
            .attr("r", () => {
              let r = newInnerXScale.bandwidth() / 2;
              if (newYScale.bandwidth() / 2 < r) {
                r = newYScale.bandwidth() / 2;
              }
              return r;
            })
            .attr("fill", (d) => {
              if (
                !this.arrangements[this.selectedOrder] &&
                this.selectedOrder !== "firstName" &&
                this.selectedOrder !== "age"
              ) {
                return newColorScale(d[this.selectedOrder]);
              } else {
                if (this.selectedOrder === "firstName") {
                  return this.arrangements.party[d.party].color;
                } else if (this.selectedOrder === "age") {
                  return this.arrangements.ageGroup[d.ageGroup].color;
                } else {
                  return this.arrangements[this.selectedOrder][d[this.selectedOrder]].color;
                }
              }
            });

          createLegend(newColorScale)
        };

        const callUpdateFunction = () => {
          const newColorScale = getColorScale();
          const newXOuter = getOuterXDomain();
          const newXInner = getInnerXDomain(newXOuter.length);
          const newYDomain = getYDomain(newXInner.length);
          updateSeatArrangement(
            newXOuter,
            newXInner,
            newYDomain,
            newColorScale
          );
        };

        // Listen to changes on the dropdowns
        /////////////////////////////////////

        // Listen to changes on the selected council
        d3.select("#council").on("change", (event) => {
          event.preventDefault();
          this.selectedCouncil = event.target.value;
          this.updateUrl();
          this.$emit("changeCouncil", this.selectedCouncil);

          const myThis = this;
          d3.selectAll(".seat")
            .transition()
            .duration(500)
            .style("opacity", 0)
            .on("end", function () {
              myThis.drawParliament();
            });
        });

        // Listen to changes on the seat arrangement
        d3.select("#arrangement").on("change", (event) => {
          event.preventDefault();
          this.selectedArrangement = event.target.value;
          this.updateUrl();
          callUpdateFunction(this.selectedArrangement, this.selectedOrder);
        });

        // Listen to changes on group order
        d3.select("#order").on("change", (event) => {
          event.preventDefault();
          this.selectedOrder = event.target.value;
          this.updateUrl();
          callUpdateFunction(this.selectedArrangement, this.selectedOrder);
        });
      };

      // Function to get the get outer x-scale items and domain
      const getOuterXDomain = () => {
        // Outer x-Scale - depends on the arrangement
        let xOuterItems, xOuterDomain;

        // Set the outer x-scale domain

        if (!this.arrangements[this.selectedArrangement] && this.selectedArrangement !== "firstName") {
          // It's numerical
          // Get the max of all councillors
          const max = d3.max(
            this.dataset,
            (councillor) => councillor[this.selectedArrangement]
          );
          if (this.selectedArrangement === "age") {
            const min = d3.min(this.dataset, (councillor) => councillor.age);
            xOuterDomain = Array.from(
              { length: max - min + 1 },
              (_, i) => i + min
            );
          } else {
            xOuterDomain = Array.from(Array(max + 1).keys());
            if (this.selectedArrangement === "nrOfCouncilMemberships") {
              xOuterDomain.shift();
            }
          }
        } else {
          if (this.selectedArrangement === "firstName") {
            // If arranged by name, all councillors belong to the same group
            xOuterItems = [""];
            xOuterDomain = [""];
          } else {
            // Else, the councillors are grouped by the selected arrangement
            xOuterItems = Object.keys(this.arrangements[this.selectedArrangement]);
            xOuterDomain = xOuterItems.map(
              (item) => this.arrangements[this.selectedArrangement][item][this.language]
            );
          }
        }
        return xOuterDomain;
      };

      // Function to get the inner x-scale domain
      const getInnerXDomain = (nrOfOuterGroups) => {
        let xInnerDomain;
        // The inner scale is given by the maxSeatsPerRow divided by number of outer groups
        xInnerDomain = Array.from(
          Array(Math.ceil(maxSeatsPerRow / nrOfOuterGroups)).keys()
        );
        return xInnerDomain;
      };

      // Function to get the y-scale domain
      // ...and to add/change special inner indices !!!
      const getYDomain = (nrOfInnerGroups) => {
        // y-Scale - depends on largest group: Number of members / xInnerDomain
        let yScaleDomain;

        if (this.selectedArrangement === "firstName") {
          yScaleDomain = Array.from(
            Array(Math.ceil(this.dataset.length / maxSeatsPerRow)).keys()
          );

          this.dataset.sort((a, b) => {
            return d3.ascending(a[this.selectedOrder], b[this.selectedOrder]);
          });

          // Add innerIdx
          this.dataset.forEach((item, index) => {
            item.innerIdx = index;
          });
        } else {
          // Group the this.dataset by the selected arrangement
          const groupedDataset = d3.groups(this.dataset, (d) => d[this.selectedArrangement]);
          // E.g. this.dataset = [
          //   [ "VS", [...] ],
          //   [ "S", [...] ],
          //   ...
          // ]

          groupedDataset.forEach((group) => {
            // Sort group according to order
            group[1].sort((a, b) => {
              return d3.ascending(a[this.selectedOrder], b[this.selectedOrder]);
            });

            // Add innerIdx to get positioning right later
            group[1].forEach((item, index) => {
              const datasetItem = this.dataset.find(({ id }) => id === item.id);
              datasetItem.innerIdx = index;
            });
          });

          // Get the number of members of the largest group
          const largestGroup = d3.max(groupedDataset, (group) => {
            return group[1].length;
          });

          // Set the y-scale domain
          // It's the number of seat rows of the largest group
          yScaleDomain = Array.from(
            Array(Math.ceil(largestGroup / nrOfInnerGroups)).keys()
          );
        }
        return yScaleDomain;
      };

      // Function to get a possible linear color scale
      const getColorScale = () => {
        let colorScale;
        if (!this.arrangements[this.selectedOrder] && this.selectedOrder !== "firstName" && this.selectedOrder !== "age") {
          // It's numerical

          // Get the max of all councillors
          const max = d3.max(
            this.dataset,
            (councillor) => councillor[this.selectedOrder]
          );

          colorScale = d3
            .scaleLinear()
            .domain([0, max])
            .range(["lightgrey", "black"]);
        }
        return colorScale;
      };

      // Get the color scale (it's undefined or not)
      ///////////////////////////////////////////
      const colorScale = getColorScale();

      // Get the actual outer x-scale domain
      ///////////////////////////////////////////
      const outerXDomain = getOuterXDomain();

      // Get the actual inner x-scale domain
      ///////////////////////////////////////////
      const innerXDomain = getInnerXDomain(outerXDomain.length);

      // Get the actual y-scale domain
      ///////////////////////////////////////////
      const yDomain = getYDomain(innerXDomain.length);

      // Draw the parliament
      ///////////////////////////////////////////
      drawArrangement(
        outerXDomain,
        innerXDomain,
        yDomain,
        colorScale
      );
    },
  },
};
</script>

<style scoped>
#tooltip {
  text-align: center;
  display: none;
  position: fixed;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 4px;
  padding: 5px;
}

img {
  border-radius: 50%;
  width: 8em;
}

.name {
  font-weight: bold;
}
</style>
