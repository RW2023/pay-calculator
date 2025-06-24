"use client";

export default function BackButton() {
    return (
       <button
            onClick={() => window.history.back()}
            className="btn btn-sm m-1 border border-[var(--color-teal)] text-[var(--color-teal)] bg-transparent hover:bg-[var(--color-neutral)]"
        >
            Back
        </button>
      
    );
}

