<template>
  <div class="container page">
    <header class="row">
      <div class="col-8">
        <div class="logo">
          <a href="https://kmapper.com" target="_blank"
            ><img :src="logo" alt="The kmapper logo"
          /></a>
        </div>
      </div>
      <div class="col-4">
        <div class="languages">
          <span :class="{isSelected: language === 'de' }" @click="setLanguage('de')">DE</span>
          <span :class="{isSelected: language === 'fr' }" @click="setLanguage('fr')">FR</span>
          <span :class="{isSelected: language === 'it' }" @click="setLanguage('it')">IT</span>
          <span :class="{isSelected: language === 'rm' }" @click="setLanguage('rm')">RM</span>
          <span :class="{isSelected: language === 'en' }" @click="setLanguage('en')">EN</span>
        </div>
      </div>
    </header>

    <main class="row" id="nationalrat">
      <section class="title row">
        <div class="col-12">
          <h1>{{ labels.council[language] }} <a href="#about">*</a></h1>
        </div>
      </section>

      <section class="row" id="chart">
        <div class="col-12">
          <the-parliament :lang="language"></the-parliament>
        </div>
      </section>

      <section class="row" id="dropdowns">
        <div class="col-6">
          <the-dropdown
            :type="'arrangement'"
            :lang="language"
          ></the-dropdown>
        </div>
        <div class="col-6">
          <the-dropdown :type="'order'" :lang="language"></the-dropdown>
        </div>
      </section>

      <section class="row" id="about">
        <div class="col-12">
          <p>
            * Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in
            vulputate velit esse molestie consequat, vel illum dolore eu feugiat
            nulla facilisis at vero eros et accumsan et iusto odio dignissim qui
            blandit praesent luptatum zzril delenit augue duis dolore te feugait
            nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore
            magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
            nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip
            ex ea commodo consequat. Duis autem vel eum iriure dolor in
            hendrerit in vulputate velit esse molestie consequat, vel illum
            dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto
            odio dignissim qui blandit praesent luptatum zzril delenit augue
            duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta
            nobis eleifend option congue nihil imperdiet doming id quod mazim
            placerat facer possim assum. Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
            enim ad minim veniam, quis nostrud exerci tation ullamcorper
            suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis
            autem vel eum iriure dolor in hendrerit in vulputate velit esse
            molestie consequat, vel illum dolore eu feugiat nulla facilisis. At
            vero eos et accusam et justo duo dolores et ea rebum. Stet clita
            kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
            amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
            diam nonumy eirmod tempor invidunt ut labore et dolore magna
            aliquyam erat, sed diam voluptua. At vero eos et accusam et justo
            duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
            sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
            consetetur sadipscing elitr, At accusam aliquyam diam diam dolore
            dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt
            justo labore Stet clita ea et gubergren, kasd magna no rebum.
            sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit
            amet. Lorem ipsum dolor sit amet, consetetur
          </p>
        </div>
      </section>
    </main>

    <footer class="row">
      <div class="col-12">
        &#169; 2021 Cyrill Martin - kmapper GmbH - Data and code available on
        <a href="https://github.com/cyrill-martin/nationalrat" target="_blank"
          >GitHub</a
        >
      </div>
    </footer>
  </div>
</template>

<script>
import TheParliament from "./components/TheParliament.vue";
import TheDropdown from "./components/TheDropdown.vue";
import labels from "./data/labels.json";

export default {
  name: "App",
  components: {
    TheParliament,
    TheDropdown,
  },
  data() {
    return {
      labels,
      language: "de",
    };
  },
  computed: {
    logo() {
      return require("./assets/images/kmapper_k_3b.png");
    },
  },
  methods: {
    setLanguage(lang) {
      this.language = lang;
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
.page {
  position: relative;
  min-height: 100vh;
  padding: 0 1.5rem;
}

header {
  height: 4rem;
}

.languages {
  font-size: 0.8rem;
  float: right;
}

.languages span {
  margin-right: 0.5rem;
  cursor: pointer;
}

.isSelected {
  font-weight: bold;
}

.logo {
  padding-top: 1rem;
}

img {
  width: 120px;
}

#nationalrat {
  margin: auto;
  width: 75%;
}

#chart {
  border: solid 1px lightgrey;
  border-radius: 16px;
}

#about {
  margin-top: 4rem;
}

footer {
  margin-top: 2rem;
  height: 3rem;
}

@media only screen and (max-width: 45em) {
  header {
    height: 0;
  }

  .page {
    padding: 0;
  }
}
</style>
