import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


type Props = {};

const SearchBar: React.FC<Props> = () => {
  const navigate = useNavigate();
  const { keyword: search} = useParams();
  const [keyword, setKeyword] = useState(search || '');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };
  return (
    <Form onSubmit={handleSubmit} className="pt-4 d-flex  w-50">
      <Form.Control
        type="text"
        name="keyword"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder={"Search Riders"}
        className="h-25"
      ></Form.Control>
      <Button type="submit" size="sm">
        Search
      </Button>
    </Form>
  );
};

export default SearchBar;
