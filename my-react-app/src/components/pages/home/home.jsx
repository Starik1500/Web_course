import Header from '../../header/header.jsx';
import Main_section from '../../main/main.jsx';
import Class_section from '../../class/class.jsx';
import Footer from '../../footer/footer.jsx';

const Home_page = () => {
    return (
    <div>
      <Header showSearch={true}/>
      <Main_section />
      <Class_section />
      <Footer />
    </div>
    );
  };
  
  export default Home_page;