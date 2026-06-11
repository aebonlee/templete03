// 유튜브 임베드 — videoId 없으면 placeholder
export default function YouTube({ videoId, title }) {
  if (!videoId) {
    return (
      <div className="lesson__video lesson__video--placeholder">
        <span className="mono">▶ 영상 준비 중</span>
      </div>
    )
  }
  return (
    <div className="lesson__video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title || 'lesson video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
