<template>
  <div class="container page">
    <header>
      <div class="row">
        <div class="col-12">
          <div class="logo">
            <a href="/"><img :src="logo" alt="The kmapper logo" /></a>
          </div>
          <div class="languages">
            <button
              :class="{ isSelected: language === 'de' }"
              @click="setLanguage('de')"
            >
              DE
            </button>
            <button
              :class="{ isSelected: language === 'fr' }"
              @click="setLanguage('fr')"
            >
              FR
            </button>
            <button
              :class="{ isSelected: language === 'it' }"
              @click="setLanguage('it')"
            >
              IT
            </button>
            <button
              :class="{ isSelected: language === 'rm' }"
              @click="setLanguage('rm')"
            >
              RM
            </button>
            <button
              :class="{ isSelected: language === 'en' }"
              @click="setLanguage('en')"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
    <main class="row" id="nationalrat">
      <section class="title row">
        <div class="col-12">
          <h1>{{ labels.council[language] }}</h1>
          <p>{{ labels.intro[language] }}<a href="#about">*</a></p>
        </div>
      </section>
      <section class="row" id="chart">
        <div class="col-12">
          <the-parliament :lang="language"></the-parliament>
        </div>
      </section>
      <section class="row" id="dropdowns">
        <div class="col-6">
          <the-dropdown :type="'arrangement'" :lang="language"></the-dropdown>
        </div>
        <div class="col-6">
          <the-dropdown :type="'order'" :lang="language"></the-dropdown>
        </div>
      </section>
      <section class="row" id="about">
        <div class="col-12">
          <h3>* {{ labels.data[language] }}:</h3>
          <p>
            Der Grossteil der angezeigten Daten wurde Mitte November 2021 direkt
            über die
            <a href="http://ws-old.parlament.ch" target="_blank"
              >offene Schnittstelle</a
            >
            von
            <a href="https://www.parlament.ch" target="_blank">parlament.ch</a>
            bezogen (<a
              href="https://github.com/cyrill-martin/nationalrat/blob/main/extras/get_councillors.py"
              target="_blank"
              >Script</a
            >). Daten und Code sind auf
            <a
              href="https://github.com/cyrill-martin/nationalrat"
              target="_blank"
              >GitHub</a
            >
            verfügbar.
          </p>
          <p>
            <b>{{ selections.occupationalField[language] }}</b
            >: Es ist schwierig, die einzelnen Parlamentarier:innen in
            Berufsgruppen einzuteilen (<a
              href="https://www.srf.ch/news/schweiz/die-jobs-der-neugewaehlten-im-neuen-nationalrat-sitzen-noch-mehr-berufspolitiker"
              target="_blank"
              >srf.ch</a
            >,
            <a
              href="https://www.nau.ch/politik/bundeshaus/diese-berufe-dominieren-im-neuen-nationalrat-65602824"
              target="_blank"
              >nau.ch</a
            >). Die Berufsangaben auf parlament.ch sind ungenau, deshalb wurden
            alle Parlamentarier:innen ohne Angaben zur Arbeitsstelle als
            Berufspolitiker:innen eingeordnet. Auch solche, die gemäss
            Berufsangaben Inhaber:in oder CEO eines Unternehmens sind, dieses
            Unternehmen aber nicht als Arbeitsstelle angegeben haben. Ebenfalls
            als Berufspolitiker:innen eingeordnet wurden Parlamentarier:innen
            mit einer Anstellung bei einem Wirtschaftsverband oder einer anderen
            Interessengemeinschaft.<br />
            Alle anderen Tätigkeiten wurden einem übergreifenden Berufsfeld
            zugewiesen.
          </p>
          <p>
            <b>{{ selections.nrOfPaidConcerns[language] }}</b
            >: Die über die Schnittstelle bezogenen Daten enthalten die
            Interessenbindungen der Parlamentarier, aber es ist nicht vermerkt,
            ob es sich um ein bezahltes oder ehrenamtliches Mandat handelt. Die
            Daten wurden mit den Angaben im Register der Interssenbindungen des
            Nationalrats manuell ergänzt (<a
              href="https://github.com/cyrill-martin/nationalrat/blob/main/extras/interessen-nr.pdf"
              target="_blank"
              >Dokument</a
            >).
          </p>
          <p>
            <br />
            <br />
            Cyrill Martin<br />
            <a href="mailto:cyrill.martin@kmapper.com"
              >cyrill.martin@kmapper.com</a
            >
          </p>
        </div>
      </section>
    </main>
    <footer class="row">
      <div class="col-12">
        &#169; 2021 Cyrill Martin -
        <a href="https://kmapper.com" target="_blank">kmapper GmbH</a> -
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
import selections from "./data/selections.json";

export default {
  name: "App",
  components: {
    TheParliament,
    TheDropdown,
  },
  data() {
    return {
      labels,
      selections,
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
    },
  },
};
</script>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  padding: 0 1.5rem;
}

header {
  height: 4rem;
  padding-top: 1rem;
}

.languages {
  font-size: 0.8rem;
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  z-index: 10;
}

.languages button {
  margin-left: 0.25rem;
  cursor: pointer;
  border: none;
  background: none;
}

.isSelected {
  font-weight: bold;
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
  margin-left: auto;
  margin-right: auto;
  width: 60%;
  font-size: 0.9rem;
}

footer {
  margin-top: 2rem;
  height: 3rem;
}

@media only screen and (max-width: 65em) {
  header {
    padding-top: 0;
  }

  img {
    width: 90px;
  }

  .page {
    padding: 0;
  }

  #nationalrat {
    margin: auto;
    width: 95%;
  }

  #about {
    margin-top: 4rem;
    margin-left: auto;
    margin-right: auto;
    width: 95%;
  }
}
</style>
