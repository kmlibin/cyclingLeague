import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

//bootstrap and react icons
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { IoCloseSharp } from "react-icons/io5";

type SearchProps = {
  createRoute: boolean;
};

const SearchBar: React.FC<SearchProps> = ({ createRoute }) => {
  const navigate = useNavigate();
  const { keyword: search, tab } = useParams();
  const [keyword, setKeyword] = useState(search);

  //ref for the formvalue
  const inputRef = useRef<HTMLInputElement | null>(null);

  //determine what route user is on
  const baseRoute = createRoute ? "/createteam" : "/cyclists";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //grab value of the input with ref
    const inputValue = inputRef.current?.value || "";
    //set state for the keyword to appear to the right of the button
    setKeyword(inputValue);

    if (inputValue.trim()) {
      const route = tab
        ? `${baseRoute}/${tab}/search/${inputValue}`
        : `${baseRoute}/search/${inputValue}`;
      navigate(route);
      //reset the input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } else {
      const route = tab ? `${baseRoute}/${tab}/search` : `${baseRoute}`;
      navigate(route);
    }
  };

  //remove the keyword so it effectively resets the search (minus any tabs selected)
  const removeKeyword = () => {
    setKeyword("");
    const route = tab ? `${baseRoute}/${tab}/search` : `${baseRoute}`;
    navigate(route);
  };

  //clear keyword state if the route path changes, that way the keyword won't display in search bar or
  //to the right if you move from /cyclists to /createteam and vice versa
  useEffect(() => {
    setKeyword("");
  }, [baseRoute]);

  return (
    <Form onSubmit={handleSubmit} className="pt-4 d-flex  w-50 mb-2">
      <div className="d-flex w-100">
        <Form.Control
          type="text"
          name="keyword"
          defaultValue={keyword}
          placeholder="Search Riders"
          ref={inputRef}
        ></Form.Control>
        <Button type="submit" size="sm" style={{ marginLeft: "5px" }}>
          Search
        </Button>
      </div>
      {search && (
        <div className=" keyword-container">
          <span className="bold">{search}</span>
          <IoCloseSharp className="close" onClick={removeKeyword} />
        </div>
      )}
    </Form>
  );
};

export default SearchBar;
