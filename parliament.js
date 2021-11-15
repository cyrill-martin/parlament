// Set the language
let language = "de";

// The fractions
const fractions = {
  S: {
    color: "#cc3a3d",
    de: "Sozialdemokratische Fraktion",
    fr: "Groupe Socialiste",
    it: "Gruppo Socialista",
    rm: "Fracziun Socialdemocratica",
    en: "Social Democrats",
  },
  G: {
    color: "#4f7b58",
    de: "Grüne Fraktion",
    fr: "Groupe des VERT-E-S",
    it: "Gruppo dei Verdi",
    rm: "Fracziun Verda",
    en: "Green Group",
  },
  GL: {
    color: "#8ab8a2",
    de: "Grünliberale Fraktion",
    fr: "Groupe Vert'Libéral",
    it: "Gruppo Verde Liberale",
    rm: "Fracziun Verdiliberala",
    en: "Green liberal group",
  },
  RL: {
    color: "#4F6777",
    de: "FDP-Liberale Fraktion",
    fr: "Groupe Libéral-Radical",
    it: "Gruppo Liberale Radicale",
    rm: "Fracziun Liberaldemocratica",
    en: "FDP. The Liberals Group",
  },
  "M-E": {
    color: "#de8e4e",
    de: "Die Mitte-Fraktion. Die Mitte. EVP.",
    fr: "Le Groupe du Centre. Le Centre. PEV.",
    it: "Il Gruppo del Centro. Alleanza del Centro. PEV.",
    rm: "La Fracziun dal Center. Allianza dal Center. PEV.",
    en: "The Centre Group. The Centre. EPP.",
  },
  V: {
    color: "#306437",
    de: "Fraktion der Schweizerischen Volkspartei",
    fr: "Groupe de l'Union Démocratique du Centre",
    it: "Gruppo dell'Unione Democratica di Centro",
    rm: "Fracziun da la Partida Populara Svizra",
    en: "Swiss People's Party",
  },
};

// The genders
const genders = {
  f: {
    color: "black",
    de: "Frau",
    fr: "Femme",
    it: "Donna",
    rm: "Dunna",
    en: "Woman",
  },
  f: {
    color: "pink",
    de: "Mann",
    fr: "Femme",
    it: "Donna",
    rm: "Dunna",
    en: "Man",
  },
};

const drawParliament = async () => {
  // Load the data
  let dataset = await d3.json("N_council.json");

  // Prepare the SVG
  ///////////////////////////////////////////////

  // Set dimensions
  const dimensions = {
    width: 1000,
    height: 400,
    margins: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
    ctrWidth: null,
    ctrHeight: null,
  };

  // Create and set inner container width
  dimensions.ctrWidth =
    dimensions.width - (dimensions.margins.left + dimensions.margins.right);
  // Create and set inner container height
  dimensions.ctrHeight =
    dimensions.height - (dimensions.margins.top + dimensions.margins.bottom);

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

  // Group the data by seating parameter
  dataset = d3.groups(dataset, (d) => d.faction);
  // dataset = [
  //   [ "VS", [...] ],
  //   [ "S", [...] ],
  //   ...
  // ]

  // Create final council object
  const council = {};

  largestGroup = 0;

  dataset.forEach((group) => {
    // Keep track of largest fraction
    if (largestGroup < group[1].length) {
      largestGroup = group[1].length;
    }

    // // Sort councillors of each group by first name
    // group[1].sort((a, b) => {
    //   return d3.ascending(a.firstName, b.firstName);
    // });

    // Create final council object
    council[group[0]] = group[1];
  });

  const fractionsOrder = ["S", "G", "GL", "RL", "M-E", "V"];
  const genderOrder = ["f", "m"];

  const fractionRowSeats = 5;
  const fractionSpacing = dimensions.ctrWidth * 0.02;
  const fractionWidth =
    (dimensions.ctrWidth - (fractionsOrder.length - 1) * fractionSpacing) /
    fractionsOrder.length;
  const seatSpacing = fractionWidth * 0.05;
  const seatWidth =
    (fractionWidth - (fractionRowSeats - 1) * seatSpacing) / fractionRowSeats;

  // Function to create the seating
  const drawArrangement = (fraction, index) => {

    const fractionGroup = ctr
      .append("g")
      .attr(
        "transform",
        `translate(${index * (fractionWidth + fractionSpacing)}, 0)`
      )
      .attr("class", "fraction")
      .attr("id", fraction);

    fractionGroup
      .selectAll("circle")
      .data(council[fraction])
      .join("circle")
      .attr("class", `${fraction}_seat`)
      .attr("id", (d, i) => `${fraction}_${i}`)
      .attr("cx", (d, i) => {
        return (i % fractionRowSeats) * (seatWidth + seatSpacing);
      })
      .attr("cy", (d, i) => {
        return Math.floor(i / fractionRowSeats) * (seatWidth + seatSpacing);
      })
      .attr("r", seatWidth / 2)
      .attr("stroke", fractions[fraction].color)
      .attr("fill", fractions[fraction].color);
  };

  // Actually create the fraction seats
  fractionsOrder.forEach((fraction, index) => drawArrangement(fraction, index));
};

drawParliament();
