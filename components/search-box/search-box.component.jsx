import "./search-box.styles.css";

const SearchBox = ({ className, placeholder, onChangeHandler }) => (
  <input
    className={`search-box`}
    type="search"
    placeholder={placeholder}
    onChange={onChangeHandler}
  />
);

// class SearchBox extends Component {
//   render() {
//     return (
//
//   }
// }

export default SearchBox;
