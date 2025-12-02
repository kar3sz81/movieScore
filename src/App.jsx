
//a handleOK vagy a movie hoz nem fer hozza , vagy a ratedMovie hoz nem fer hozza.
//a ratedMovies setRatedmovies a kkulcs, azt kellett vola feltolteni adatbazisba, es lehivni, mert a ratedmovies area-ba is azt hasznalja

//1 npm install @supabase/supabase-js
//ignore row level security a security policybe vagy hol
//lehessen uj mozit letrehozni
//lehessen irni ha baj van az oldallal
//magyar zaszlora kattintani magyaritasert.
//toltokepernyo csapó, ami számol a négyzetbe
//blur háttèr bejelentkezés
//csillagátlagolás mutatása.
//sort: csillag/név alapján


import { useRef, useState } from "react";
import "./App.css";
import supabase from "./supabase-client";
import { useEffect } from "react";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [movies, setMovies] = useState([]);
  const [searchWord, setSearchWord] = useState("dune");
  const [movieProfileSelected, setMovieProfileSelected] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  // Keep a stable user value across re-renders (initialized only once)
  // Initialize as empty, then set once from an external API on mount
  const [user, setUser] = useState("");
  useEffect(() => {
    let isActive = true;
    const fetchRandomName = async () => {
      try {
        // Fetch a random user name from an external API
        const res = await fetch("https://randomuser.me/api/");
        const data = await res.json();
        const result = data?.results?.[0];
        const first = result?.name?.first;
        const last = result?.name?.last;
        const fullName = [first, last].filter(Boolean).join(" ");
        if (isActive) setUser(fullName || "Guest");
      } catch (e) {
        // Fallback to a guest identifier if API fails
        if (isActive)
          setUser(`Guest ${Math.round(Math.random() * 1000).toString()}`);
      }
    };
    fetchRandomName();
    return () => {
      isActive = false;
    };
  }, []);
  // Avatar behavior:
  // - Should change on every full page reload.
  // - Should remain stable during a single session (no changes across re-renders).
  // To achieve this, generate a seed once per mount and avoid persisting it to storage.
  const avatarSeedRef = useRef(null);
  if (!avatarSeedRef.current) {
    avatarSeedRef.current = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
  const avatarURL = `https://i.pravatar.cc/48?u=${encodeURIComponent(
    avatarSeedRef.current
  )}`;
  //const full = false;
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  // Expanded card state and inline comment editing state
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [commentEdited, setCommentEdited] = useState({}); // imdbID -> bool
  const [commentText, setCommentText] = useState({}); // imdbID -> string
  const commentRefs = useRef({}); // imdbID -> textarea/input element

  // Rated movies and submission tracking
  const [ratedMovies, setRatedMovies] = useState([]); // array of movie objects
  const [submitted, setSubmitted] = useState({}); // imdbID -> true when OK was clicked
  // Hover state for search-result card stars
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  // Selected rating per movie (1..10)
  const [selectedRating, setSelectedRating] = useState({}); // imdbID -> number

  console.log(rating);

  useEffect(() => {
    fetchTodos();
    fetch(`http://www.omdbapi.com/?s=${searchWord}&apikey=960ffa73`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.Search);
        setMovies(data.Search);
      });
  }, [searchWord]);

  const fetchTodos = async () => {
    const { data, error } = await supabase.from("todoList").select("*");
    if (error) {
      console.log("baj van a feccsel", error);
    } else {
      setTodoList(data);
    }
  };

  // Focus the comment box and place caret before the first character (index 0)
  useEffect(() => {
    if (expandedMovieId && commentRefs.current[expandedMovieId]) {
      const el = commentRefs.current[expandedMovieId];
      try {
        el.focus();
        // Place caret at the very beginning
        if (typeof el.setSelectionRange === "function") {
          el.setSelectionRange(0, 0);
        }
      } catch (e) {
        // no-op for environments where focusing might fail
      }
    }
  }, [expandedMovieId]);

  // Auto-resize helper so the textarea height fits its content
  const autoResize = (el) => {
    if (!el) return;
    try {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    } catch (_) {
      // ignore sizing errors
    }
  };

  // Keep expanded textarea sized when opening or its text changes
  useEffect(() => {
    if (expandedMovieId && commentRefs.current[expandedMovieId]) {
      autoResize(commentRefs.current[expandedMovieId]);
    }
    // Also resize all rated movie textareas in case their text changed
    if (ratedMovies?.length) {
      ratedMovies.forEach((m) => autoResize(commentRefs.current[m._entryId || m.imdbID]));
    }
  }, [expandedMovieId, commentText, ratedMovies]);



/*




    useEffect(() => {




        const uploadMovieData = async () => {
            try {


                const newLikedMovieData = {
                    imdbID: ratedMovies.imdbID,
                    Title: ratedMovies.Title,
                    Year: ratedMovies.Year,
                    Poster:ratedMovies.Poster,
                    UserName:user,
                    UserAvatarURL:avatarURL,
                    UserRating:selectedRating,
                    UserComment:commentText

                };

                console.log("ezt a muvit kuldted be(movie): ",ratedMovies);
                console.log("ezt fogod feltolteni Supabasebe(newlikedMovieData): ",newLikedMovieData);




                const { data, error } = supabase
                    .from("moviescore")
                    .insert([newLikedMovieData])
                    .select()
                    .single();

                if (error) {
                    console.log("error adding movieCard: ", error);
                } else {
                    //setTodoList((prev) => [...prev, data]);
                    console.log("moviescore data added:",data);
                    //setNewTodo("");
                }

            } catch (e) {
              console.log(e);
            }
        };
        uploadMovieData();



    }, [ratedMovies]);



*/




















  const handleStarClick = (movie, value) => {
    // store selected rating for this movie
    if (typeof value === "number") {
      setSelectedRating((prev) => ({ ...prev, [movie.imdbID]: value }));
    }
    // Re-open the textbox for editing if this movie was previously submitted
    // by clearing its submitted flag. This enables the textarea again.
    setSubmitted((prev) => {
      if (!prev[movie.imdbID]) return prev;
      const { [movie.imdbID]: _removed, ...rest } = prev;
      return rest;
    });
    setExpandedMovieId(movie.imdbID);
    // Initialize default text placeholder if not yet set
    setCommentText((prev) =>
      prev[movie.imdbID] !== undefined
        ? prev
        : { ...prev, [movie.imdbID]: "comment.." }
    );
    setCommentEdited((prev) => ({ ...prev, [movie.imdbID]: prev[movie.imdbID] || false }));
  };

  const handleCommentKeyDown = (movieId) => (e) => {
    if (!commentEdited[movieId]) {
      const isPrintable = e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
      if (isPrintable) {
        e.preventDefault();
        setCommentEdited((prev) => ({ ...prev, [movieId]: true }));
        setCommentText((prev) => ({ ...prev, [movieId]: e.key }));
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        setCommentEdited((prev) => ({ ...prev, [movieId]: true }));
        setCommentText((prev) => ({ ...prev, [movieId]: "" }));
      }
    }
  };

  const handleCommentChange = (movieId) => (e) => {
    if (!commentEdited[movieId]) {
      // If somehow change occurs without keydown (e.g., paste), treat as first edit and replace all.
      setCommentEdited((prev) => ({ ...prev, [movieId]: true }));
      setCommentText((prev) => ({ ...prev, [movieId]: e.target.value }));
    } else {
      setCommentText((prev) => ({ ...prev, [movieId]: e.target.value }));
    }
    // Resize the textarea as the user types
    autoResize(commentRefs.current[movieId]);
  };

  // When user clicks OK on a movie card
  const handleOk = async (movie) => {

console.log("igy nez ki a (movie): ",movie);

      console.log("most feltoltjuk  adattal (movie)-bol a (newLikedMovieData)-t");

      const newLikedMovieData = {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster:movie.Poster,
          //Type: movie.Type,

          userName:user,
          avatarURL:avatarURL,
          rating:selectedRating[movie.imdbID],
          userComment:commentText[movie.imdbID],
      };
      console.log("ezt fogod feltolteni Supabasebe(newlikedMovieData): ",newLikedMovieData);
      console.log(user)
      console.log(avatarURL);
      console.log(selectedRating[movie.imdbID]);
      console.log(commentText[movie.imdbID]);


      const { data, error } = await supabase
          .from("moviescore")
          .insert([newLikedMovieData])
          .select()
          .single();

      if (error) {
          console.log("error adding movieCard: ", error);
      } else {
          //setTodoList((prev) => [...prev, data]);
          console.log("moviescore data added:",data);
          //setNewTodo("");
      }



      //megis ide, csak ratedMovies legyen a movie hejett.
      //a masik feltoltesi kierletet meg kommenteld ki.. (*useffect felul)
      //elotte varakoztatni 2 masodpercig hogy tuti a jo ratedmovieshoz nyukljon hozza??




      //sajat cucc START
/*
console.log("vartun 10 szekundumot, most feltotltjuk  adattal a newLikedMovieData-t");

      const newLikedMovieData = {
          imdbID: ratedMovies.imdbID,
          Title: ratedMovies.Title,
          Year: ratedMovies.Year,
          Poster:ratedMovies.Poster,
          Type: ratedMovies.Type,

         // UserName:user,
         // UserAvatarURL:avatarURL,
         // UserRating:selectedRating,
         // UserComment:commentText


      };

      console.log("ezt a muvit kuldted be innen, from:(ratedMovies): ",ratedMovies);
      console.log("ezt fogod feltolteni Supabasebe(newlikedMovieData): ",newLikedMovieData);




      const { data, error } = await supabase
          .from("moviescore")
          .insert([newLikedMovieData])
          .select()
          .single();

      if (error) {
          console.log("error adding movieCard: ", error);
      } else {
          //setTodoList((prev) => [...prev, data]);
          console.log("moviescore data added:",data);
          //setNewTodo("");
      }

*/

      //sajat cucc VEGE



      // Always create a new copy in ratedMovies (even if it existed before)
    // and append it under previously created cards.
    const newEntry = {
      ...movie,
      rating: selectedRating[movie.imdbID] || 0,
      // Persist the exact comment used for this saved copy so each duplicate keeps its own text
      savedComment:
        commentText[movie.imdbID] ?? "comment..",
      _entryId: `${movie.imdbID}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    setRatedMovies((prev) => [...prev, newEntry]);
    // Clear any previously selected rating for this movie in the search list.
    // This ensures that when the movie appears again among search results,
    // no stars are shown filled until the user clicks a star again.
    setSelectedRating((prev) => {
      const { [movie.imdbID]: _removed, ...rest } = prev;
      return rest;
    });
    // mark as submitted to freeze textarea and hide OK button
    setSubmitted((prev) => ({ ...prev, [movie.imdbID]: true }));
    // Reset the in-search comment state so the textarea shows the default
    // "comment.." next time this movie is opened in the search area
    setCommentText((prev) => {
      const { [movie.imdbID]: _removed, ...rest } = prev;
      return rest;
    });
    setCommentEdited((prev) => {
      const { [movie.imdbID]: _removed, ...rest } = prev;
      return rest;
    });
    // clear search input and results, collapse any expanded card
    setExpandedMovieId(null);
    setSearchWord("");
    setMovies(null);
    // Ensure the rated-movies textarea will fit its content after it renders
    setTimeout(() => autoResize(commentRefs.current[newEntry._entryId || movie.imdbID]), 0);
  };

  const clickedOnAsearchResult = (movie) => {
    setMovieProfileSelected(!movieProfileSelected);
    setSelectedMovie({ movie });
    console.log(selectedMovie);
  };

  const printSomething = (number) => {
    console.log(`${number}csillag klikk`);
  };



/*
  const addTodo = async () => {
    const newTodoData = {
      name: newTodo,
      isCompleted: false,
    };
    const { data, error } = await supabase
      .from("todoList")
      .insert([newTodoData])
      .select()
      .single();

    if (error) {
      console.log("error adding todo: ", error);
    } else {
      setTodoList((prev) => [...prev, data]);
      console.log("todo added");
      setNewTodo("");
    }
  };
*/



  const pipa = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("todoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.log("error pipa muvelettel: ", error);
    } else {
      const newTodoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(newTodoList);
    }
  };

  const deleteTodo = async (id) => {
    console.log("delete soon");
    const { data, error } = await supabase
      .from("todoList")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("error torlessel: ", error);
    } else {
      const filteredTodos = todoList.filter((todo) => todo.id !== id);
      setTodoList(filteredTodos);
    }
  };

  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }
  {
    /*return */
  }



    const handleOK2 = async () => {
        const newLikedMovieData = {
            ImdbID: "70",
            Title: "pifPuff film",
            Year: "2022",
            Poster:"www.itvvan.hu",
            UserName:"jorj bush",
            UserAvatarID:"71",
            UserStars:5,
            UserComment:"blabla bla"

        };

        console.log("dummy movie data:",newLikedMovieData)

        const { data, error } = await supabase
            .from("moviescore")
            .insert([newLikedMovieData])
            .select()
            .single();

        if (error) {
            console.log("error adding movieCard: ", error);
        } else {
            //setTodoList((prev) => [...prev, data]);
            console.log("moviescore data added:",data);
            //setNewTodo("");
        }


    };


  return (
    <div class="relative flex flex-col items-start max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8">
      <div class="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
        <div class="text-left">
          <p class="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            <div class="bg-white p-8 rounded-2xl w-full max-w-sm ">
              {/*LOG IN part */}
              {/*LOG IN part */}
              {/*LOG IN part */}
              {/*LOG IN part */}
              {/*LOG IN part */}
              {/*LOG IN part */}

              <div class="flex-col items-center">
                <div class="flex items-center">
                  <img
                    src={avatarURL}
                    alt="Profile Picture"
                    class="w-8 h-8 rounded-full mt-4"
                  />
                  <div class="m-2">
                    <h2 class="text-sm font-semibold mt-2">Hi, {user}!</h2>
                    <p class="text-gray-500 text-xs">Long time not see..</p>
                  </div>
                </div>
              </div>

              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}
              {/*MAin title: MOVIE SCORE */}

              <h2 class="text-5xl font-extrabold leading-10 tracking-tight text-gray-800 sm:text-5xl sm:leading-none md:text-5xl">
                Movie
                <span class="font-bold text-blue-500">Score</span>
                {/*<span class="text-xs font-semibold rounded-full text-blueGray-500">
                    by kar3sz
                  </span>*/}
              </h2>
            </div>
          </p>

          {/*search */}
          {/*search */}
          {/*search */}
          {/*search */}
          {/*search */}
          {/*search */}
          {/*search */}

          <div class="mx-7 sm:flex md:mt-8">
            <div class="rounded-md ">
              <div class="bg-white  rounded-lg">
                <div class="relative bg-inherit">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    class="peer bg-transparent h-10 w-72 rounded-lg text-gray-800 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                    onChange={(e) => setSearchWord(e.target.value)}
                    value={searchWord}
                  />
                  <label
                    for="username"
                    class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                  >
                    search for a movie
                  </label>
                </div>
              </div>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3"></div>
          </div>

          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}
          {/* search result MOVIE-CARD*/}

          {movies && (
            <ul class="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-sm">
              {movies.map((movie) => (
                <li
                  key={movie.imdbID}
                  class={`px-6 py-4 ${
                    expandedMovieId && expandedMovieId !== movie.imdbID
                      ? "filter blur-[1px] opacity-50"
                      : ""
                  }`}
                >
                    <div class="flex justify-between">
                        <span class="font-semibold text-lg">{movie.Title}</span>
                        <span class="text-gray-500 text-xs">{movie.Year}</span>
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 active:translate-y-[1px]"
                            onClick={handleOK2}
                        >
                            OK
                        </button>
                    </div>
                    <img class="w-full" src={movie.Poster}/>

                    {/*      START stars        */}
                    {/*      START stars        */}
                    {/*      START stars        */}
                    {/*      START stars        */}
                    {/*      START stars        */}
                    <div class="mt-3 flex items-center justify-between w-full" aria-label="10-level rating">
                    {/* Hollow stars that fill on hover, span full image width */}
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(1); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 1)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=1) || (selectedRating[movie.imdbID] >= 1) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(2); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 2)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=2) || (selectedRating[movie.imdbID] >= 2) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(3); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 3)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=3) || (selectedRating[movie.imdbID] >= 3) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(4); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 4)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=4) || (selectedRating[movie.imdbID] >= 4) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(5); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 5)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=5) || (selectedRating[movie.imdbID] >= 5) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(6); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 6)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=6) || (selectedRating[movie.imdbID] >= 6) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(7); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 7)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=7) || (selectedRating[movie.imdbID] >= 7) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(8); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 8)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=8) || (selectedRating[movie.imdbID] >= 8) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(9); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 9)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=9) || (selectedRating[movie.imdbID] >= 9) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                    <svg onMouseEnter={() => { setHoveredMovieId(movie.imdbID); setHoverRating(10); }} onMouseLeave={() => { setHoverRating(0); setHoveredMovieId(null); }} onClick={() => handleStarClick(movie, 10)} class="cursor-pointer w-6 h-6 text-yellow-500 transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                      <path class={`${(hoveredMovieId===movie.imdbID && hoverRating>=10) || (selectedRating[movie.imdbID] >= 10) ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                    </svg>
                  </div>
                  {expandedMovieId === movie.imdbID && (
                    <div class="mt-4 pt-4 border-t border-gray-200">
                      {/* Section 1: avatar + user name */}
                      <div class="flex items-center space-x-3 mb-3">
                        <img src={avatarURL} alt="avatar" class="w-10 h-10 rounded-full" />
                        <div class="text-sm text-gray-700 font-medium">{user || "Guest"}</div>
                      </div>

                      {/* Section 2: textbox with pre-existing text and caret at start */}
                      <div class="mb-3">
                        <textarea
                          ref={(el) => (commentRefs.current[movie.imdbID] = el)}
                          class={`w-full resize-none overflow-hidden p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 ${submitted[movie.imdbID] ? "bg-gray-100 border-gray-200 text-gray-500" : "border-gray-300"}`}
                          rows={1}
                          value={commentText[movie.imdbID] ?? "comment.."}
                          onKeyDown={handleCommentKeyDown(movie.imdbID)}
                          onChange={handleCommentChange(movie.imdbID)}
                          disabled={!!submitted[movie.imdbID]}
                          readOnly={!!submitted[movie.imdbID]}
                        />
                      </div>

                      {/* Section 3: OK button bottom-left under textbox */}
                      <div class="flex">
                        {submitted[movie.imdbID] ? null : (
                          <button
                            type="button"
                            class="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 active:translate-y-[1px]"
                            onClick={() => handleOk(movie)}
                          >
                            OK
                          </button>

                        )}
                      </div>
                    </div>
                  )}
                    {/*
                  <div class="flex justify-center items-center bg-white p-8 mr-9 shadow-slate-200 rounded-lg w-auto space-x-1 lg:space-x-2">
                    <button
                      onClick={() => setRating(1)}
                      onMouseEnter={() => setTempRating(1)}
                      onMouseLeave={() => setTempRating(0)}
                    >
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        {rating >= 1 || tempRating >= 1 ? (
                          <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z" />
                        ) : (
                          <path d=" M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                        )}
                      </svg>
                    </button>

                    <button
                      onClick={() => setRating(2)}
                      onMouseEnter={() => setTempRating(2)}
                      onMouseLeave={() => setTempRating(0)}
                    >
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        {rating >= 2 || tempRating >= 2 ? (
                          <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z" />
                        ) : (
                          <path d=" M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                        )}
                      </svg>
                    </button>

                    <button
                      onClick={() => setRating(3)}
                      onMouseEnter={() => setTempRating(3)}
                      onMouseLeave={() => setTempRating(0)}
                    >
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        {rating >= 3 || tempRating >= 3 ? (
                          <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z" />
                        ) : (
                          <path d=" M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                        )}
                      </svg>
                    </button>

                    <button
                      onClick={() => setRating(4)}
                      onMouseEnter={() => setTempRating(4)}
                      onMouseLeave={() => setTempRating(0)}
                    >
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        {rating >= 4 || tempRating >= 4 ? (
                          <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z" />
                        ) : (
                          <path d=" M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                        )}
                      </svg>
                    </button>

                    <button
                      onClick={() => setRating(5)}
                      onMouseEnter={() => setTempRating(5)}
                      onMouseLeave={() => setTempRating(0)}
                      class="mr-2"
                    >
                      <svg
                        class="text-yellow-500 w-5 h-auto fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                      >
                        {rating >= 5 || tempRating >= 5 ? (
                          <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z" />
                        ) : (
                          <path d=" M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z" />
                        )}
                      </svg>
                    </button>

                    <span class="text-slate-400 font-medium">Rate Here!</span>
                  </div>
*/}
                  {/*      END stars        */}
                  {/*      END stars        */}
                  {/*      END stars        */}
                  {/*      END stars        */}
                  {/*      END stars        */}
                </li>
              ))}
            </ul>
          )}












































          {/* Rated movies Area */}
          <div class="mt-8">
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Rated Movies</h3>
            {/* Group rated entries by imdbID so duplicates appear under the same movie */}
            {(() => {
                console.log("igy nez ki a ratedMovies: ",ratedMovies)
              const groups = ratedMovies.reduce((acc, entry) => {
                const id = entry.imdbID;
                if (!acc[id]) acc[id] = [];
                acc[id].push(entry);
                return acc;
              }, {});
              const ids = Object.keys(groups);
              if (ids.length === 0) return (
                <div class="text-sm text-gray-500">No rated movies yet.</div>
              );
              return (
                <ul class="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-sm">
                  {ids.map((id) => {
                    const entries = groups[id];
                    // Use the first entry as the main card (with poster)
                    const main = entries[0];
                    const rest = entries.slice(1);
                    return (
                      <li key={`${id}-group`} class="px-6 py-4">
                        {/* Main movie header */}
                        <div class="flex justify-between">
                          <span class="font-semibold text-lg">{main.Title}</span>
                          <span class="text-gray-500 text-xs">{main.Year}</span>
                        </div>
                        {/* Show poster only for the first (main) entry */}
                        {main.Poster && (
                          <img class="w-full" src={main.Poster} />
                        )}
                        {/* Render the saved content for the main entry */}
                        <div class="mt-4 pt-4 border-t border-gray-200">
                          <div class="mb-3 flex items-center justify-between w-full text-yellow-500">
                            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                              <svg key={n} class="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                                <path class={`${(main.rating || 0) >= n ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                              </svg>
                            ))}
                          </div>
                          <div class="flex items-center space-x-3 mb-3">
                            <img src={avatarURL} alt="avatar" class="w-10 h-10 rounded-full" />
                            <div class="text-sm text-gray-700 font-medium">{user || "Guest"}</div>
                          </div>
                          <div class="mb-3">
                            <textarea
                              ref={(el) => (commentRefs.current[main._entryId || main.imdbID] = el)}
                              class="w-full resize-none overflow-hidden p-2 border border-gray-200 rounded bg-gray-100 text-gray-500"
                              rows={1}
                              value={
                                main.savedComment ??
                                commentText[main.imdbID] ??
                                "comment.."
                              }
                              disabled
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Render duplicates under the same movie WITHOUT poster */}
                        {rest.length > 0 && (
                          <div class="mt-6 space-y-6">
                            {rest.map((dup) => (
                              <div key={dup._entryId} class="pt-4 border-t border-gray-200">
                                {/* No title/year and no poster for duplicates */}
                                <div class="mb-3 flex items-center justify-between w-full text-yellow-500">
                                  {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                                    <svg key={n} class="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true">
                                      <path class={`${(dup.rating || 0) >= n ? 'fill-current' : 'fill-transparent'}`} stroke="currentColor" stroke-width="30" stroke-linejoin="round" d="M316.9 17.97L381.2 150.3 524.9 171.5c11.9 1.7 21.9 10.1 25.7 21.6s-.1 23.6-8.7 32.2L438.5 328.1 463.1 474.7c2 12-2.9 24.2-12.9 31.3s-23 6.9-33.7 1.2L288.1 439.8 159.8 508.3c-10.8 5.7-23.9 4.8-33.8-2.3s-14.9-19.3-12.8-31.3L137.8 328.1 33.58 225.9c-8.61-8.6-11.67-21.2-7.89-32.8s13.77-21.5 25.68-23.2L195 150.3 259.4 17.97C264.7 6.954 275.9-.039 288.1-.039s23.4 6.993 28.8 18.009z"/>
                                    </svg>
                                  ))}
                                </div>
                                <div class="flex items-center space-x-3 mb-3">
                                  <img src={avatarURL} alt="avatar" class="w-10 h-10 rounded-full" />
                                  <div class="text-sm text-gray-700 font-medium">{user || "Guest"}</div>
                                </div>
                                <div class="mb-1">
                                  <textarea
                                    ref={(el) => (commentRefs.current[dup._entryId || dup.imdbID] = el)}
                                    class="w-full resize-none overflow-hidden p-2 border border-gray-200 rounded bg-gray-100 text-gray-500"
                                    rows={1}
                                    value={
                                      dup.savedComment ??
                                      commentText[dup.imdbID] ??
                                      "comment.."
                                    }
                                    disabled
                                    readOnly
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              );
            })()}
          </div>
        </div>
      </div>
        {/*
      <div>
        {movieProfileSelected && selectedMovie && (
          <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div class="md:flex">
              <div class="md:shrink-0">
                <img
                  class="h-48 w-full object-cover md:h-full md:w-48"
                  src={selectedMovie.Poster}
                  alt="User profile picture"
                />
              </div>
              <div class="p-8">
                <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {selectedMovie.Title}
                  {console.log(selectedMovie.Title)}
                </div>
                <p class="mt-2 text-slate-500">
                  "This product changed my life! I can't imagine going back to
                  how things were before. Absolutely revolutionary."
                </p>
                <div class="mt-4">
                  <span class="text-slate-900 font-bold">Sarah Johnson</span>
                  <span class="text-slate-600 text-sm ml-2">
                    CEO, TechInnovate
                  </span>
                </div>
                <div class="mt-4 flex items-center">
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg
                    class="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        <ul class="bg-white rounded-lg shadow divide-y divide-gray-200 max-w-sm mt-16">
          {todoList.map((todo) => (
            <li key={todo.id} class="px-6 py-4">
              <div class="flex justify-between">
                <span class="font-semibold text-lg">List Item {todo.id}</span>
                <span class="text-gray-500 text-xs">1 day ago</span>
              </div>
              <p class="text-gray-700">{todo.name}</p>

              <div class="flex flex-wrap justify-center gap-6">
                <a class="relative" href="#">
                  <span class="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                  <span
                    onClick={() => pipa(todo.id, todo.isCompleted)}
                    class="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-3 py-1 text-base font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900"
                  >
                    {todo.isCompleted ? "undo" : "complete"}
                  </span>
                </a>
                <a href="#" class="relative">
                  <span class="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-gray-700"></span>
                  <span
                    onClick={() => deleteTodo(todo.id)}
                    class="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-black px-3 py-1 text-base font-bold text-white transition duration-100 hover:bg-gray-900 hover:text-yellow-500"
                  >
                    delete
                  </span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>*/}
    </div>
  );
}

export default App;
