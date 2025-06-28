import React, { useRef, useState, useEffect } from 'react';
import uniqid from 'uniqid';
import Quill from 'quill';
import { assets } from '../../assets/assets';

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);

  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0
              ? chapters[chapters.length - 1].chapterOrder + 1
              : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    } else if (action === 'submit') {
      const updatedChapters = chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, lectureDetails],
          };
        }
        return chapter;
      });

      setChapters(updatedChapters);
      setLectureDetails({
        lectureTitle: '',
        lectureDuration: '',
        lectureUrl: '',
        isPreviewFree: false,
      });
      setShowPopup(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const addLecture = () => {
  setChapters(
    chapters.map((chapter) => {
      if (chapter.chapterId === currentChapterId) {
        const newLecture = {
          ...lectureDetails,
          lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
          lectureId: uniqid()
        };
        chapter.chapterContent.push(newLecture);
      }
      return chapter;
    })
  );
  setShowPopup(false);
  setLectureDetails({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });
};

  return (
    <div className="h-screen overflow-y-auto flex flex-col md:p-8 p-4 pt-8 bg-gray-50">
      <h1 className="text-2xl font-bold">Add Course</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 max-w-md w-full text-gray-700">
        {/* Course Title */}
        <div className="flex flex-col gap-1">
          <label>Course Title</label>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-400"
            required
          />
        </div>

        {/* Course Description */}
        <div className="flex flex-col gap-1">
          <label>Course Description</label>
          <div ref={editorRef} className="border border-gray-400 rounded p-2"></div>
        </div>

        {/* Price and Image */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label>Course Price</label>
            <input
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="outline-none py-2 px-3 w-28 rounded border border-gray-400"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Course Thumbnail</label>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3 cursor-pointer">
              <img
                src={assets.file_upload_icon}
                alt=""
                className="p-3 bg-blue-500 rounded"
              />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
            </label>
            {image && (
              <div className=" p-2 rounded ">
                <img
                  className="max-h-20 object-contain"
                  src={URL.createObjectURL(image)}
                  alt="Thumbnail"
                />
              </div>
            )}
          </div>
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1">
          <label>Discount %</label>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            min={0}
            max={100}
            placeholder="0"
            className="outline-none py-2 px-3 w-28 rounded border border-gray-400"
            required
          />
        </div>

        {/* Chapters List */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.chapterId} className="bg-white border rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                  <img
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                    className={`cursor-pointer transition-transform ${
                      chapter.collapsed ? '-rotate-90' : 'rotate-0'
                    }`}
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                  />
                  <span className="font-semibold">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {chapter.chapterContent.length} Lectures
                </span>
                <img
                  src={assets.cross_icon}
                  alt=""
                  className="cursor-pointer"
                  onClick={() => handleChapter('remove', chapter.chapterId)}
                />
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      key={lectureIndex}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        {lectureIndex + 1}. {lecture.lectureTitle} - {lecture.lectureDuration} mins -{' '}
                        <a
                          href={lecture.lectureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="!text-blue-500 underline"
                        >
                          Link
                        </a>{' '}
                        - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                      </span>
                      <img
                        src={assets.cross_icon}
                        alt=""
                        className="cursor-pointer"
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                      />
                    </div>
                  ))}
                  <button
                    className="bg-gray-200 px-3 py-1 mt-2 rounded text-sm hover:bg-gray-300"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                    type="button"
                  >
                    + Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="bg-blue-100 p-2 rounded-lg text-blue-700 w-fit hover:bg-blue-200"
          onClick={() => handleChapter('add')}
        >
          + Add Chapter
        </button>

        {/* Popup for Adding Lecture */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px] z-50">
            <div className="bg-white p-4 rounded shadow-md w-full max-w-sm !text-gray-700 relative">
              <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

              <div className="mb-2">
                <label>Lecture Title</label>
                <input
                  type="text"
                  className="w-full border rounded py-1 px-2"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full border rounded py-1 px-2"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })
                  }
                />
              </div>
              <div className="mb-2">
                <label>Lecture URL</label>
                <input
                  type="text"
                  className="w-full border rounded py-1 px-2"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2 items-center my-3">
                <label>Free Preview?</label>
                <input
                  type="checkbox"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })
                  }
                />
              </div>
              <button
                type="button"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded"
                onClick={addLecture}
              >
                Add Lecture
              </button>
              <img
                onClick={() => setShowPopup(false)}
                src={assets.cross_icon}
                className="absolute top-4 right-4 w-4 cursor-pointer"
                alt=""
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2.5 px-8 rounded mt-6 hover:bg-blue-700"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
