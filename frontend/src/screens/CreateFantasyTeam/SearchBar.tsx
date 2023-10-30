import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

//bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const { keyword: search, tab } = useParams();
  const [keyword, setKeyword] = useState(search || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      const route = tab
        ? `/cyclists/${tab}/search/${keyword}`
        : `/search/${keyword}`;
      navigate(route);
      setKeyword("");
    } else {
      const route = tab ? `/cyclists/${tab}` : "/";
      navigate(route);
    }
  };
  return (
    <Form onSubmit={handleSubmit} className="pt-4 d-flex  w-50 mb-2">
      <Form.Control
        type="text"
        name="keyword"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Riders"
        
      ></Form.Control>
      <Button type="submit" size="sm" style={{marginLeft: "5px"}}>
        Search
      </Button>
    </Form>
  );
};

export default SearchBar;
