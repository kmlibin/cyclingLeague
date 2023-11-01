import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

//bootstrap and react icons
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { IoCloseSharp } from "react-icons/io5";

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { keyword: search, tab } = useParams();
  const [keyword, setKeyword] = useState(search || "");

  //ref for the formvalue
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //grab value of the input with ref
    const inputValue = inputRef.current?.value || "";
    //set state for the keyword to appear to the right of the button
    setKeyword(inputValue);
    if (inputValue.trim()) {
      const route = tab
        ? `/cyclists/${tab}/search/${inputValue}`
        : `/cyclists/search/${inputValue}`;
      navigate(route);
    } else {
      const route = tab ? `/cyclists/${tab}/search` : "/cyclists";
      navigate(route);
    }
  };

  //remove the keyword so it effectively resets the search (minus any tabs selected)
  const removeKeyword = () => {
    setKeyword("");
    const route = tab ? `/cyclists/${tab}/search` : `/cyclists`;
    navigate(route);
  };

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
        {keyword && (
          <div className=" keyword-container">
            {keyword}
            <IoCloseSharp className="close" onClick={removeKeyword} />
          </div>
        )}
      </Form>
  );
};

export default SearchBar;
