import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFriend, setAddFriend] = useState(initialFriends);
  const [selectdFriend, setSelectdFriend] = useState(null);

  function handleShowAddForm() {
    setShowAddForm((showAddForm) => !showAddForm);
  }

  function handleAddNewFriend(friend) {
    setAddFriend((friends) => [...friends, friend]);
    setShowAddForm(false);
  }

  function handleSelection(friend) {
    setSelectdFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplit(value) {
    console.log(value);
    setAddFriend((addFriend) =>
      addFriend.map((friend) =>
        friend.id === selectdFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectdFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friendData={addFriend}
          onSelction={handleSelection}
          selectdFriend={selectdFriend}
        />

        {showAddForm && (
          <FormAddFriend handleAddNewFriend={handleAddNewFriend} />
        )}

        <Button onClick={handleShowAddForm}>
          {showAddForm ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectdFriend && (
        <FormSplitBill
          selectdFriend={selectdFriend}
          handleSplit={handleSplit}
        />
      )}
    </div>
  );
}

function FriendList({ friendData, onSelction, selectdFriend }) {
  return (
    <ul>
      {friendData.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelction={onSelction}
          selectdFriend={selectdFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelction, selectdFriend }) {
  const isSelected = selectdFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe You {friend.balance}$
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} both are even</p>}
      <Button onClick={() => onSelction(friend)}>
        {isSelected ? "Close" : "Submit"}
      </Button>
    </li>
  );
}

function FormAddFriend({ handleAddNewFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc//48");

  function handleAddFriend(e) {
    e.preventDefault();

    if (!name || !image) return;

    let id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    setImage("https://i.pravatar.cc//48");
    setName("");
    handleAddNewFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>🧍Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormSplitBill({ selectdFriend, handleSplit }) {
  const [billAmt, setBillAmt] = useState(0);
  const [userExps, setUserExps] = useState(0);
  const paid = billAmt ? billAmt - userExps : "";
  const [paidID, setPaidID] = useState("User");

  function handleSubmit(e) {
    e.preventDefault();
    if (!billAmt || !userExps) return;
    handleSplit(paidID === "User" ? paid : -userExps);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split bill With {selectdFriend?.name}</h2>
      <label>💰 Bill Value</label>
      <input
        type="number"
        value={billAmt}
        onChange={(e) => {
          setBillAmt(Number(e.target.value));
        }}
      />

      <label>🙍 Your Expence</label>
      <input
        type="number"
        value={userExps}
        onChange={(e) => {
          setUserExps(
            Number(e.target.value) > billAmt ? billAmt : Number(e.target.value)
          );
        }}
      />

      <label>🧍 {selectdFriend?.name}' Expence</label>
      <input type="number" value={paid} disabled />

      <label>🤑 Who is playing Bill ?</label>
      <select value={paidID} onChange={(e) => setPaidID(e.target.value)}>
        <option value="User">You</option>
        <option value="Friend">{selectdFriend?.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
