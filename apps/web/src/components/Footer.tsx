type FooterProps = {
  name: string;
  githubUrl: string | null;
};

export function Footer({ name, githubUrl }: FooterProps) {
  return (
    <footer className="border-t border-zinc-900 px-6 py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between text-sm text-zinc-500">
        <p>
          &copy; {new Date().getFullYear()} {name}
        </p>
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noreferrer" className="hover:text-zinc-300">
            GitHub
          </a>
        )}
      </div>
    </footer>
  );
}