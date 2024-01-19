import { RandomBeerList } from '../../components/RandomBeerList/RandomBeerList';
import { SavedBeerList } from '../../components/SavedBeerList/SavedBeerList';

const Home = () => (
  <article>
    <section>
      <main>
        <RandomBeerList />
        <SavedBeerList />
      </main>
    </section>
  </article>
);

export default Home;
