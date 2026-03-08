import { useState } from "react";
import { Download, FileText, Table, Loader2, ChevronDown } from "lucide-react";
import { reports } from "@/lib/api";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonProps {
    type: string;
    data: any;
    title: string;
    label?: string;
}

export default function ExportButton({ type, data, title, label = "Export Report" }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (format: 'pdf' | 'excel') => {
        setIsExporting(true);
        try {
            const response = await reports.export(type, format, data, title);

            // Create a link and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const extension = format === 'pdf' ? 'pdf' : 'xlsx';
            link.setAttribute('download', `sentinex-${type}-${Date.now()}.${extension}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success(`${format.toUpperCase()} report generated successfully`);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error(`Failed to generate ${format.toUpperCase()} report`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                    {isExporting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    {label}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/5 bg-background/95 backdrop-blur-xl">
                <DropdownMenuItem
                    onClick={() => handleExport('pdf')}
                    className="flex items-center gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                    <FileText className="w-4 h-4" />
                    <span>Download PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleExport('excel')}
                    className="flex items-center gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary"
                >
                    <Table className="w-4 h-4" />
                    <span>Download Excel</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
