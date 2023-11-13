import React, { useEffect, useState } from "react";

const Table = () => {
  const [data, setData] = useState();
  const [filtered, setFiltered] = useState();
  const [input, setInput] = useState("");
  const [array, setArray] = useState([]);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [currentPage, setcurrentPage] = useState(0);
  const perPage = 10;
  const [totalPage,setTotalPage] = useState(0);

  const getData = async () => {
    const response = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    const json = await response.json();
    if (json.length > 0) {
      setData(json);
      setFiltered(json);
      setTotalPage(json.length);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const handleSearch = () => {
    const arr = data.filter(
      (item) =>
        item.name.toLowerCase().includes(input.toLowerCase()) ||
        item.email.toLowerCase().includes(input.toLowerCase()) ||
        item.role.toLowerCase().includes(input.toLowerCase())
    );
    setFiltered(arr);
  };
  const handleDelete = (id) => {
    console.log(id, "delete called");
    const arr = filtered.filter((item) => item.email !== id);
    setFiltered(arr);
  };

  const handleDeleteSelected = () => {
    const arrayCopy = [...array]; //good pratice
    let arr = [...filtered];
    arrayCopy.forEach((items) => {
      arr = arr.filter((item) => item.email !== items);
      // console.log(items, "sonu");
    });
    setArray([]);
    setFiltered(arr);
  };

  // const handleEdit = ({ name, id, field }) => {
  //   const arr = filtered.map((item) => {
  //     if (item.id === id) {
  //       return { ...item, [field]: name };  //variable name ==square bravkets
  //     } else {
  //       return item;
  //     }
  //   });
  //   setFiltered(arr);
  // };

  const startIndex = currentPage * perPage;
  const lastIndex = startIndex + perPage;
  const diplayData = filtered?.slice(startIndex, lastIndex);
  

  return (
    <div className="grid ">
     <div className="">
        <input
          className="p-2 m-2 border-2 border-black rounded-md "
          type="text"
          placeholder="Search your data in this?"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-gray-300 p-2 m-2 rounded-lg "
          onClick={handleSearch}
        >
          Search
        </button>
        <button
          className="bg-gray-300 p-2 m-2 rounded-lg "
          onClick={handleDeleteSelected}
        >
          Delete Selected
        </button>
        </div>
      <table className="w-screen ">
        <tr className="border-2 border-black m-2 p-2">
          <th></th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        {diplayData?.map((item, index) => (
          <tr className="border-2 border-gray-500 m-2 p-4 ml-20">
            <input
              className="border-2 border-black"
              type="checkbox"
              onChange={() => {
                if (array.includes(item.email)) {
                  setArray(array.filter((items) => items !== item.email));
                } else setArray((prev) => [...prev, item.email]);
              }}
            />
            {/* <td> */}
              {/* {editing ? (
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleEdit(e.target.value, item.id, "name")}
                />
              ) : (
                item.name
              )} */}
            {/* </td> */}
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.role}</td>
            <button className="p-2 m-2" onClick={() => setEditing(true)}>
              🖊️
            </button>
            <button
              className="p-2 m-2"
              onClick={() => handleDelete(item?.email)}
            >
              📦
            </button>
          </tr>
        ))}
      </table>
      <div className="flex p-2 m-2 justify-center">
      <button className="bg-gray-300 p-4 m-2"
        onClick={() => {
          if (currentPage > 1) {
            setcurrentPage((prev)=>prev - 1);
          }
        }}
      >
        Prev
      </button>
      <h1 className="p-4 m-2">{currentPage}</h1>
      <button className="bg-gray-300 p-4 m-2" onClick={() => {
        if(currentPage<Math.ceil(totalPage/perPage)-1)
        setcurrentPage((prev) =>prev + 1)}}>Next</button>
    </div>
    </div>
  );
};

export default Table;
