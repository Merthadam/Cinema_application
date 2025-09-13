function MovieCard({ movie, selected }) {
  return (
    <div
      className={`
        w-full max-w-[180px] rounded-2xl p-3
        bg-gradient-to-br from-gray-800 via-gray-900 to-black
        shadow-xl transition-all duration-300 flex flex-col items-center
        ${selected ? 'ring-2 ring-lime-400' : 'hover:shadow-2xl hover:scale-[1.03] hover:brightness-110'}
      `}
    >
      <div className="rounded-xl overflow-hidden aspect-[2/3] w-full">
        <img
          src={new URL(`${movie.image_path}`, import.meta.url).href}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full text-white text-center mt-3">
        <h2 className="text-md font-bold leading-tight break-words">
          {movie.title}
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          {movie.genre}&nbsp;
          <span className="text-white font-light">
            {movie.duration} perc
          </span>
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
