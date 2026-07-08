export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`glass rounded-3xl p-8 ${className}`}>
            {children}
        </div>
    );
}