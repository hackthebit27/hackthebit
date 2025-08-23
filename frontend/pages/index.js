// pages/index.js

import Image from 'next/image';

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-blue-100 to-blue-300 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center bg-blue-700 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Coding for Every Indian – From Kids to Professionals
        </h1>
        <p className="mb-6 text-lg md:text-xl">
          Learn coding in your own language, your own style, with real mentors and peers.
        </p>
        <div className="space-x-4">
          <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition">
            Start Learning Free
          </button>
          <button className="bg-white hover:bg-gray-200 text-blue-700 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition">
            Explore Courses
          </button>
        </div>
      </section>

      {/* Who is this for? */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Who Is This For?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 text-center">
            <div className="text-6xl mb-3">👶</div>
            <h3 className="font-bold text-lg mb-2">Kids (8–12 yrs)</h3>
            <p>Learn coding with games & stories.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 text-center">
            <div className="text-6xl mb-3">🎓</div>
            <h3 className="font-bold text-lg mb-2">Students</h3>
            <p>Build logic, ace exams, and start projects.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 text-center">
            <div className="text-6xl mb-3">💻</div>
            <h3 className="font-bold text-lg mb-2">Graduates</h3>
            <p>Prepare for placements & coding interviews.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 text-center">
            <div className="text-6xl mb-3">🏢</div>
            <h3 className="font-bold text-lg mb-2">Professionals</h3>
            <p>Level up skills with DSA, System Design, and Performance.</p>
          </div>
        </div>
      </section>

      {/* Unique Value */}
      <section className="py-12 px-4 bg-blue-50">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Why HackTheBit?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
          <div>
            <div className="text-5xl mb-2">🎯</div>
            <p>Real mentors, not just AI</p>
          </div>
          <div>
            <div className="text-5xl mb-2">🇮🇳</div>
            <p>Learn in Hindi, Tamil, Bengali, Marathi</p>
          </div>
          <div>
            <div className="text-5xl mb-2">⚡</div>
            <p>Hands-on coding challenges & hackathons</p>
          </div>
          <div>
            <div className="text-5xl mb-2">🤝</div>
            <p>Career guidance & mock interviews from real engineers</p>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Courses Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-4xl mb-2">🧩</div>
            <p>Logic with Games (Kids)</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-4xl mb-2">📚</div>
            <p>Intro to Arrays & DSA (Students)</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <p>Crack Placements with LeetCode + System Design (Graduates)</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-4xl mb-2">🚀</div>
            <p>Performance Engineering in C++ (Professionals)</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition hover:bg-blue-800">
            See All Courses
          </button>
        </div>
      </section>

      {/* Community + Mentorship */}
      <section className="py-12 px-4 bg-green-50">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Community & Mentorship
        </h2>
        <p className="max-w-3xl mx-auto text-center text-lg">
          At HackTheBit, you don’t just learn from videos.  
          You learn with a community of real learners & mentors who share your journey.
        </p>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          No matter your background, coding is for you.
        </h2>
        <p className="mb-6 text-lg md:text-xl">
          Start your journey with HackTheBit today.
        </p>
        <button className="bg-green-400 hover:bg-green-600 px-8 py-4 rounded-lg text-xl font-bold shadow-lg transition">
          Get Started Free
        </button>
      </section>
    </main>
  );
}
