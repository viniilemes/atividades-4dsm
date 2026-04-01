import { useBooks } from "../context/BooksContext";
import { MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";

export default function CourseFilter() {
  const { books } = useBooks();
  const [selected, setSelected] = useState("");

  const courses = [...new Set(books.map(book => book.course))];

  const filteredBooks = books.filter(b => selected === "" || b.course === selected);

  return (
    <>
      <Typography variant="h5">Filtrar por Disciplina</Typography>
      <Select value={selected} onChange={e => setSelected(e.target.value)} sx={{ mb: 2 }}>
        <MenuItem value="">Todas</MenuItem>
        {courses.map(course => (
          <MenuItem key={course} value={course}>{course}</MenuItem>
        ))}
      </Select>
      {filteredBooks.map((book, idx) => (
        <Typography key={idx}>{book.title} - {book.course}</Typography>
      ))}
    </>
  );
}
