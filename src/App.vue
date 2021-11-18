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
          <span
            :class="{ isSelected: language === 'de' }"
            @click="setLanguage('de')"
            >DE</span
          >
          <span
            :class="{ isSelected: language === 'fr' }"
            @click="setLanguage('fr')"
            >FR</span
          >
          <span
            :class="{ isSelected: language === 'it' }"
            @click="setLanguage('it')"
            >IT</span
          >
          <span
            :class="{ isSelected: language === 'rm' }"
            @click="setLanguage('rm')"
            >RM</span
          >
          <span
            :class="{ isSelected: language === 'en' }"
            @click="setLanguage('en')"
            >EN</span
          >
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
          <the-dropdown :type="'arrangement'" :lang="language"></the-dropdown>
        </div>
        <div class="col-6">
          <the-dropdown :type="'order'" :lang="language"></the-dropdown>
        </div>
      </section>
      <section class="row" id="about">
        <div class="col-12">
          <h2>* Daten:</h2>
          <p>
            Die Visualisierung zeigt die 200 Mitglieder des Schweizer
            Nationalrats - Stand November 2021.
          </p>
          <p>
            Alle Angaben ohne Gewähr. Der Grossteil der angezeigten Daten wurde
            Mitte November 2021 direkt über die
            <a href="http://ws-old.parlament.ch" target="_blank"
              >offene Schnittstelle</a
            >
            von
            <a href="https://www.parlament.ch" target="_blank">parlament.ch</a>
            bezogen (<a
              href="https://github.com/cyrill-martin/nationalrat/blob/main/extras/get_councillors.py"
              target="_blank"
              >Script</a
            >). Daten und Code sind auf <a 
              href="https://github.com/cyrill-martin/nationalrat" 
              target="_blank"
              >GitHub</a> verfügbar.
          </p>
          <p>
            Zwei der Werte bedürfen einer Erklärung:
          </p>
          <h3>Berufsfeld</h3>
          <p>
            Ich bin nicht der erste, der Schwierigkeiten hatte, die einzelnen
            Parlamentarier in Berufsgruppen einzuteilen (<a
              href="https://www.srf.ch/news/schweiz/die-jobs-der-neugewaehlten-im-neuen-nationalrat-sitzen-noch-mehr-berufspolitiker"
              target="_blank"
              >srf.ch</a
            >,
            <a
              href="https://www.nau.ch/politik/bundeshaus/diese-berufe-dominieren-im-neuen-nationalrat-65602824"
              target="_blank"
              >nau.ch</a
            >). Die Berufsangaben auf parlament.ch gehen gegen nutzlos.
            Schlussendlich musste ich pragmatisch vorgehen.
          </p>
          <p>
            <ul>
              <li>
                Alle Parlamentarier ohne Angaben zum Arbeitgeber wurden 
                direkt als Berufspolitiker eingeordnet.</li>
            </ul>
          </p>
          <p>
            Dadurch wurden auch Parlamentarier zu Berufspolitikern, die gemäss 
            Berufsangaben Inhaber oder CEO eines Unternehmens sind, dieses 
            Unternehmen aber nicht als Arbeitgeber angegeben haben.
          </p>
          <p>
            <ul>
              <li>
                War der angegebene Arbeitgeber ein Wirtschaftsverband, eine 
                andere Interessengemeinschaft, etc. fiel das ebenfalls 
                unter die Kategorie Berufspolitik.
              </li>
            </ul>
          </p>
          <p>
            <ul>
              <li>
                Bei Angabe anderer Arbeitgeber habe ich versucht Arbeitgeber 
                und Tätigkeit einem groben Berufsfeld zuzuweisen.
              </li>
            </ul>
          </p>
          <h3>Anzahl bezahlte Interessenbindungen</h3>
          <p>
            Die über die Schnittstelle bezogenen Daten enthalten zwar die
            Interessenbindungen der Parlamentarier, aber anders als auf
            parlament.ch ist nicht vermerkt, ob es sich jeweils um ein bezahltes
            oder ehrenamtliches Mandat handelt. Deshalb wurden die Daten
            basierend auf
            <a
              href="https://github.com/cyrill-martin/nationalrat/blob/main/extras/interessen-nr.pdf"
              target="_blank"
              >diesem Dokument</a
            >
            entsprechend manuell ergänzt.
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
        &#169; 2021 Cyrill Martin - kmapper GmbH - Daten und Code auf
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
  float: right;
}

.languages span {
  margin-right: 0.5rem;
  cursor: pointer;
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
