
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Candidate } from '@/lib/db';
import { Trophy, Edit, Trash2 } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  rank?: number;
  isResults?: boolean;
  isAdmin?: boolean;
  onVote?: (id: number) => void;
  onEdit?: (candidate: Candidate) => void;
  onDelete?: (id: number) => void;
  isWinner?: boolean;
}

const CandidateCard = ({
  candidate,
  rank,
  isResults = false,
  isAdmin = false,
  onVote,
  onEdit,
  onDelete,
  isWinner = false
}: CandidateCardProps) => {
  return (
    <Card className={`card-hover ${isWinner ? 'border-2 border-election-accent' : ''}`}>
      <CardHeader className={isWinner ? 'bg-election-accent/10 rounded-t-md' : ''}>
        {isWinner && (
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-6 w-6 text-election-accent" />
          </div>
        )}
        <CardTitle className="flex items-center justify-between">
          <span>{candidate.name}</span>
          {isResults && rank && (
            <Badge variant={rank === 1 ? "default" : "outline"} className={rank === 1 ? "bg-election-accent" : ""}>
              #{rank}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          <span className="font-medium">{candidate.party}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl font-bold text-muted-foreground">
            {candidate.name.charAt(0)}
          </span>
        </div>
        {isResults && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Votes</p>
            <p className="text-2xl font-bold">{candidate.votes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-0">
        {onVote && (
          <Button 
            onClick={() => onVote(candidate.id)} 
            className="w-full"
          >
            Vote
          </Button>
        )}
        {isAdmin && (
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit?.(candidate)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex-1"
              onClick={() => onDelete?.(candidate.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
