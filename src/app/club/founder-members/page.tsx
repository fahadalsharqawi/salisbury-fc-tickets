import Link from "next/link";
import { MotionItem, MotionStagger } from "@/components/motion/Motion";

export const metadata = {
  title: "Founder Members — Salisbury FC",
  description:
    "The supporters whose contributions in 2015 brought Salisbury FC back to life — Founder Members of the modern club.",
};

const FOUNDERS = [
  "Adam Ainscough", "Adam Bartlett", "Alan Field", "Alan Pinkney",
  "Alex Forster", "Andrew Reading", "Andy Munns", "Anna Webb",
  "Brian Kelham", "Carl Wright", "Charlie Howse", "Chris Bartlett",
  "Chris Wilson", "Christopher Lewis", "Daniel Cull", "Darren Bromley",
  "Dave Boucher", "Dave Lawrence", "David Nash", "Derek Hibberd",
  "Don Wallace", "Doug Wallace", "Edward Mitchell", "Emma Field",
  "Eric Frampton", "Frank Sherrock", "Gary Withers", "George Doherty",
  "Graham Hill", "Helen Witty", "Ian Phillips", "Ian Pretty",
  "Jack Tomes", "James Hayes", "Jason Matthews", "Jeff Lay",
  "John Adams", "John Tomes", "Jonathan Spear", "Karen Booth",
  "Keith Edwards", "Kevin Cradduck", "Kevin Witty", "Liam Kerr",
  "Mark Reading", "Martin Bartlett", "Martyn Stevens", "Matt Howse",
  "Michael Phelan", "Mike Hibberd", "Neil Hibberd", "Nick Pinkney",
  "Paul Bevan", "Paul Lewis", "Peter Doherty", "Peter Howse",
  "Philip Bartlett", "Phil Howse", "Rebecca Field", "Richard Hibberd",
  "Robert Witty", "Roger Tomes", "Russell Field", "Sarah Wallace",
  "Simon Bartlett", "Sophie Howse", "Stephen Lewis", "Stephen Witty",
  "Steve Claridge", "Steve Whitcher", "Stuart Howse", "Susan Davies",
  "Terry Wallace", "Tim Howse", "Tim Witty", "Tom Howse",
  "Tracy Field", "Will Howse",
];

export default function FounderMembersPage() {
  return (
    <>
      <div className="sfc-band">
        <div className="sfc-container py-8 sm:py-12">
          <div className="sfc-eyebrow sfc-eyebrow--on-dark">The Club</div>
          <h1 className="sfc-display mt-1 text-3xl font-bold leading-[1.05] sm:text-5xl">
            Founder Members
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-sfc-sky-light sm:text-base">
            The supporters whose contributions in 2015 brought Salisbury FC
            back to life. Without their belief — and their cheques — there
            would be no club today.
          </p>
        </div>
      </div>

      <div className="sfc-container py-10 sm:py-14">
        <article className="anim-fade-up mx-auto max-w-3xl rounded-2xl border border-sfc-n-200 bg-white p-6 sm:p-8">
          <p className="text-[15px] leading-relaxed text-sfc-n-700">
            When the original Salisbury City was wound up in 2014, supporters
            stepped forward to fund a Phoenix club. Each Founder Member made
            a personal contribution to the share issue that capitalised
            Salisbury FC Ltd. The board has placed their names on this page
            in permanent recognition.
          </p>

          <MotionStagger
            as="ul"
            className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 text-[14px] text-sfc-n-700 sm:grid-cols-3"
            stagger={0.005}
          >
            {FOUNDERS.map((name) => (
              <MotionItem as="li" key={name} className="border-b border-sfc-n-100 py-1.5">
                {name}
              </MotionItem>
            ))}
          </MotionStagger>

          <p className="mt-6 text-xs italic text-sfc-n-500">
            Names listed alphabetically. If you were a 2015 founder and your
            name is missing or misspelt, please contact the club office.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/club/about" className="sfc-btn sfc-btn--primary press">
              ← Back to the club
            </Link>
            <Link href="/contact" className="sfc-btn sfc-btn--ghost press">
              Contact the office
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
