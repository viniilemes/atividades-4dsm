import { useBooks } from "../context/BooksContext";
import { MenuItem, Select, Typography }  from "@mui/material";
import { useState } from "react";

export default function CourseFilter() {
    const { books } = useBooks();
    const [selected, setSlected] = useState("");

    const courses = [...new Set(books.map(book => book.course))];

    const filteredBooks = books.filter(b =>  selected === "" || b.course === selected);

    return (
        <>
          <Typography variant="h5">FIltrar por diciplina</Typography>
          <Select value={selected} onChange={e => setSelected(e.target.value)} sx={{ mb: 2}}>
            <MenuItem value="">Todas</MenuItem>
            {courses.map(course => (
                <MenuItem key={course} value={course}>{course}</MenuItem>
            ))}
          </Select>
          {filteredBooks.map(book, id) => (
            <Typography key={idx}>{book.title}</Typography>
          ))}
          </>
          );
        }